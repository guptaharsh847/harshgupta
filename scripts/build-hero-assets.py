#!/usr/bin/env python3
"""
build-hero-assets.py: turn the raw intro video into the site's hero assets.

  public/hero/hero.webm      VP9 (CRF 36) + Opus 80 kbps   (first <source>)
  public/hero/hero.mp4       H.264 yuv420p (CRF 24, slow) + AAC 96 kbps, +faststart
  public/hero/poster.webp    first frame of the loop (LCP-friendly poster)
  public/portrait-bust.webp  480x600 head-to-shirt crop (from --photo, or the sharpest frame)
  public/og.jpg              1200x630 social card

Pipeline
  1. Detect the person against the light backdrop (numpy, union bbox over sampled frames)
     and crop tightly head-to-toe at the hero aspect (768:960), centred. Override with --crop.
  2. Scale to 768 px wide and whiten the backdrop with colorlevels (rimax=gimax=bimax=0.98
     for a near-white backdrop; lowered automatically if the backdrop measures grayer), so `mix-blend-mode: multiply` dissolves it into the page.
  3. Seamless loop over the first --seconds (default 10 s), no stretching or retiming:
       video: xfade the tail [L-F, L] into the head [0, F]  (output length L-F)
       audio: the same cross-fade, sample-accurate, equal-power, in numpy
     The output starts at source time F and ends on source time F, so it repeats with no jump.
  4. Encode mp4 + webm, then export the stills.

Usage
  uv run --with numpy --with imageio-ffmpeg --with pillow python scripts/build-hero-assets.py \
      [--src intro.mp4] [--photo idphoto.png] [--crop W:H:X:Y] [--whiten 0.98] [--seconds 10] [--fade 0.5]

ffmpeg is taken from PATH, falling back to the binary bundled with `imageio-ffmpeg`.
"""
from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT_W, OUT_H = 768, 960  # hero aspect 4:5
SR = 48000
PAPER = (244, 242, 238)


# ----------------------------------------------------------------------------- ffmpeg helpers
def find_ffmpeg() -> str:
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg  # type: ignore

        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("ffmpeg not found. Install it or run with `--with imageio-ffmpeg`.")


FFMPEG = find_ffmpeg()


def run(args: list[str]) -> None:
    print("  $ ffmpeg", " ".join(args[:60]))
    subprocess.run([FFMPEG, "-hide_banner", "-loglevel", "error", "-y", *args], check=True)


def probe(src: Path) -> tuple[int, int, float, float, bool]:
    """(width, height, fps, duration, has_audio) parsed from `ffmpeg -i`."""
    p = subprocess.run([FFMPEG, "-hide_banner", "-i", str(src)], capture_output=True, text=True)
    err = p.stderr
    m = re.search(r"Video:.*?(\d{2,5})x(\d{2,5})", err)
    if not m:
        sys.exit(f"Could not read a video stream from {src}")
    w, h = int(m.group(1)), int(m.group(2))
    fps_m = re.search(r"(\d+(?:\.\d+)?) fps", err)
    fps = float(fps_m.group(1)) if fps_m else 25.0
    d = re.search(r"Duration: (\d+):(\d+):(\d+(?:\.\d+)?)", err)
    dur = int(d.group(1)) * 3600 + int(d.group(2)) * 60 + float(d.group(3)) if d else 0.0
    return w, h, fps, dur, "Audio:" in err


def grab_gray(src: Path, t: float, w: int, h: int) -> np.ndarray:
    raw = subprocess.run(
        [FFMPEG, "-v", "error", "-ss", f"{t:.3f}", "-i", str(src), "-frames:v", "1",
         "-f", "rawvideo", "-pix_fmt", "gray", "-"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(raw, np.uint8)[: w * h].reshape(h, w).astype(np.float32)


def grab_png(src: Path, t: float, out: Path, vf: str | None = None) -> None:
    args = ["-ss", f"{t:.3f}", "-i", str(src), "-frames:v", "1"]
    if vf:
        args += ["-vf", vf]
    run([*args, str(out)])


# ----------------------------------------------------------------------------- 1. detection
def detect_bbox(src: Path, w: int, h: int, dur: float) -> tuple[int, int, int, int]:
    """Union bounding box (x0, y0, x1, y1) of 'not backdrop' pixels over ~8 frames."""
    mask_sum = np.zeros((h, w), np.float32)
    times = np.linspace(0.2, max(0.3, dur - 0.3), 8)
    for t in times:
        g = grab_gray(src, float(t), w, h)
        bg = np.median(g[:, : max(4, w // 12)])  # left strip = backdrop
        mask_sum += (np.abs(g - bg) > 38).astype(np.float32)
    mask = mask_sum >= 2  # pixel differs in at least 2 sampled frames
    cols = mask.sum(0)
    rows = mask.sum(1)
    xs = np.where(cols > h * 0.02)[0]  # ignore specks (watermarks, noise)
    ys = np.where(rows > w * 0.006)[0]
    if len(xs) == 0 or len(ys) == 0:
        sys.exit("Person not detected. Pass --crop W:H:X:Y explicitly.")
    return int(xs[0]), int(ys[0]), int(xs[-1]), int(ys[-1])


def crop_from_bbox(b: tuple[int, int, int, int], w: int, h: int) -> tuple[int, int, int, int]:
    x0, y0, x1, y1 = b
    bh = y1 - y0
    ch = min(h, int(bh * 1.12))  # ~6 % headroom top and bottom
    cw = int(ch * OUT_W / OUT_H)
    if cw > w:
        cw = w
        ch = int(cw * OUT_H / OUT_W)
    cx = (x0 + x1) / 2
    cy = (y0 + y1) / 2
    x = int(round(min(max(cx - cw / 2, 0), w - cw)))
    y = int(round(min(max(cy - ch / 2 - bh * 0.01, 0), h - ch)))
    even = lambda v: v - (v % 2)  # noqa: E731
    return even(cw), even(ch), even(x), even(y)


# ----------------------------------------------------------------------------- 2. whitening
def backdrop_imax(src: Path, w: int, h: int, crop: tuple[int, int, int, int], dur: float) -> float:
    """colorlevels input-max so the backdrop clips to pure white.

    0.98 is enough for a near-white studio backdrop. Grayer backdrops (e.g. ~232/255) need a
    lower ceiling: we take the 5th percentile of the backdrop strips beside the person
    (left/right 18 % of the crop, upper 80 %) and map it to 255.
    """
    cw, ch, cx, cy = crop
    vals = []
    for t in np.linspace(0.5, max(0.6, dur - 0.5), 4):
        g = grab_gray(src, float(t), w, h)[cy : cy + int(ch * 0.8), cx : cx + cw]
        side = int(cw * 0.18)
        vals.append(np.concatenate([g[:, :side].ravel(), g[:, -side:].ravel()]))
    p5 = float(np.percentile(np.concatenate(vals), 5))
    imax = min(0.98, max(0.80, p5 / 255 - 0.01))
    print(f"  backdrop p5={p5:.0f}/255 -> colorlevels imax={imax:.3f}")
    return imax


# ----------------------------------------------------------------------------- 3. audio loop
def read_audio(src: Path, start: float, length: float) -> np.ndarray:
    raw = subprocess.run(
        [FFMPEG, "-v", "error", "-ss", f"{start:.6f}", "-t", f"{length:.6f}", "-i", str(src),
         "-vn", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
        capture_output=True, check=True,
    ).stdout
    a = np.frombuffer(raw, np.float32).reshape(-1, 2)
    n = int(round(length * SR))
    if len(a) < n:  # pad if the decoder came up short
        a = np.vstack([a, np.zeros((n - len(a), 2), np.float32)])
    return a[:n]


def build_loop_audio(src: Path, L: float, F: float, out_wav: Path) -> None:
    full = read_audio(src, 0.0, L)
    n_f = int(round(F * SR))
    n_l = int(round(L * SR))
    head = full[:n_f]  # [0, F]
    body = full[n_f:n_l]  # [F, L]
    tail = body[-n_f:]  # [L-F, L]
    t = np.linspace(0.0, 1.0, n_f, dtype=np.float32)[:, None]
    fade_out, fade_in = np.cos(t * np.pi / 2), np.sin(t * np.pi / 2)  # equal power
    mixed = tail * fade_out + head * fade_in
    loop = np.vstack([body[:-n_f], mixed])  # length L - F, ends on source time F
    loop = np.clip(loop, -1.0, 1.0)
    pcm = (loop * 32767).astype("<i2")
    with wave.open(str(out_wav), "wb") as wv:
        wv.setnchannels(2)
        wv.setsampwidth(2)
        wv.setframerate(SR)
        wv.writeframes(pcm.tobytes())
    print(f"  audio loop: {len(loop) / SR:.3f}s ({len(loop)} samples, fade {n_f} samples)")


# ----------------------------------------------------------------------------- stills
def save_portrait(photo: Path | None, src: Path, crop: tuple[int, int, int, int], dur: float, tmp: Path) -> None:
    from PIL import Image, ImageFilter, ImageStat

    out = ROOT / "public" / "portrait-bust.webp"
    if photo:
        im = Image.open(photo).convert("RGB")
    else:
        # sharpest frame = highest edge variance
        cw, ch, cx, cy = crop
        best, best_score = None, -1.0
        for i, t in enumerate(np.linspace(0.3, dur - 0.3, 12)):
            p = tmp / f"cand{i}.png"
            grab_png(src, float(t), p, f"crop={cw}:{int(ch * 0.42)}:{cx}:{cy}")
            cand = Image.open(p).convert("RGB")
            score = ImageStat.Stat(cand.convert("L").filter(ImageFilter.FIND_EDGES)).var[0]
            if score > best_score:
                best, best_score = cand, score
        im = best
    # head-to-shirt crop at 4:5, centred horizontally, anchored to the top
    w, h = im.size
    tw = min(w, int(h * 0.8))
    th = int(tw / 0.8)
    left = (w - tw) // 2
    im = im.crop((left, 0, left + tw, min(h, th))).resize((480, 600), Image.LANCZOS)
    im.save(out, "WEBP", quality=86, method=6)
    print(f"  wrote {out.relative_to(ROOT)}")


def save_og(poster_png: Path) -> None:
    from PIL import Image, ImageDraw, ImageFont

    out = ROOT / "public" / "og.jpg"
    canvas = Image.new("RGB", (1200, 630), PAPER)
    person = Image.open(poster_png).convert("RGB").resize((504, 630), Image.LANCZOS)
    # multiply blend onto paper, like the site
    bg = Image.new("RGB", person.size, PAPER)
    person = Image.fromarray(
        (np.asarray(person, np.float32) * np.asarray(bg, np.float32) / 255).astype(np.uint8)
    )
    canvas.paste(person, (1200 - 504 - 40, 0))
    d = ImageDraw.Draw(canvas)
    fonts = ROOT / "src" / "fonts"

    def font(name: str, size: int):
        try:
            return ImageFont.truetype(str(fonts / name), size)
        except OSError:
            return ImageFont.load_default(size)

    sans = font("InterTight-Variable.woff2", 92)
    try:
        sans.set_variation_by_axes([760])
    except Exception:
        pass
    serif = font("InstrumentSerif-Italic.woff2", 96)
    mono = font("JetBrainsMono-Variable.woff2", 22)
    ink, mute = (13, 13, 13), (119, 117, 111)
    d.text((72, 120), "HARSH GUPTA — PORTFOLIO", font=mono, fill=mute)
    d.text((68, 190), "Full Stack", font=sans, fill=ink)
    d.text((68, 290), "MERN", font=sans, fill=ink)
    d.text((72, 386), "Developer.", font=serif, fill=mute)
    d.text((72, 540), "React.js · Node.js · Express.js · MongoDB", font=mono, fill=mute)
    canvas.save(out, "JPEG", quality=86, optimize=True, progressive=True)
    print(f"  wrote {out.relative_to(ROOT)}")


# ----------------------------------------------------------------------------- main
def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--src", default=str(ROOT / "intro.mp4"))
    ap.add_argument("--photo", default=str(ROOT / "idphoto.png"), help="portrait photo; 'none' = use video")
    ap.add_argument("--crop", help="manual crop W:H:X:Y in source pixels (skips detection)")
    ap.add_argument("--whiten", type=float, help="colorlevels imax override (default: measured, max 0.98)")
    ap.add_argument("--seconds", type=float, default=10.0)
    ap.add_argument("--fade", type=float, default=0.5)
    a = ap.parse_args()

    src = Path(a.src)
    if not src.exists():
        sys.exit(f"Source video not found: {src}")
    w, h, fps, dur, has_audio = probe(src)
    print(f"source {src.name}: {w}x{h} @ {fps:g} fps, {dur:.2f}s, audio={has_audio}")

    # frame-exact loop length and fade
    L = min(a.seconds, dur)
    L = np.floor(L * fps + 1e-6) / fps
    F = round(a.fade * fps) / fps
    if L <= 2 * F:
        sys.exit("Clip too short for the requested cross-fade.")

    if a.crop:
        cw, ch, cx, cy = (int(v) for v in a.crop.split(":"))
    else:
        bbox = detect_bbox(src, w, h, L)
        cw, ch, cx, cy = crop_from_bbox(bbox, w, h)
        print(f"  person bbox {bbox} -> crop={cw}:{ch}:{cx}:{cy}")

    imax = a.whiten if a.whiten else backdrop_imax(src, w, h, (cw, ch, cx, cy), L)

    out_dir = ROOT / "public" / "hero"
    out_dir.mkdir(parents=True, exist_ok=True)
    look = (
        f"crop={cw}:{ch}:{cx}:{cy},scale={OUT_W}:{OUT_H}:flags=lanczos,"
        f"colorlevels=rimax={imax:.3f}:gimax={imax:.3f}:bimax={imax:.3f},setsar=1,fps={fps:g}"
    )
    vgraph = (
        f"[0:v]{look},split[s0][s1];"
        f"[s0]trim=start={F}:end={L},setpts=PTS-STARTPTS,fps={fps:g}[body];"
        f"[s1]trim=start=0:end={F},setpts=PTS-STARTPTS,fps={fps:g}[head];"
        f"[body][head]xfade=transition=fade:duration={F}:offset={L - 2 * F:.6f},format=yuv420p[v]"
    )

    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        wav = tmp / "loop.wav"
        audio_in: list[str] = []
        amap: list[str] = []
        if has_audio:
            build_loop_audio(src, L, F, wav)
            audio_in = ["-i", str(wav)]
            amap = ["-map", "1:a"]

        common = ["-reinit_filter", "0", "-i", str(src), *audio_in, "-filter_complex", vgraph, "-map", "[v]", *amap,
                  "-t", f"{L - F:.6f}", "-r", f"{fps:g}"]
        run([*common, "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p",
             "-profile:v", "high", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart",
             str(out_dir / "hero.mp4")])
        run([*common, "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1",
             "-deadline", "good", "-cpu-used", "2", "-c:a", "libopus", "-b:a", "80k",
             str(out_dir / "hero.webm")])

        poster_png = tmp / "poster.png"
        grab_png(out_dir / "hero.mp4", 0.0, poster_png)
        from PIL import Image

        Image.open(poster_png).convert("RGB").save(out_dir / "poster.webp", "WEBP", quality=80, method=6)

        photo = None if a.photo.lower() == "none" else Path(a.photo)
        if photo and not photo.exists():
            photo = None
        save_portrait(photo, src, (cw, ch, cx, cy), L, tmp)
        save_og(poster_png)

    for f in ["hero/hero.mp4", "hero/hero.webm", "hero/poster.webp", "portrait-bust.webp", "og.jpg"]:
        p = ROOT / "public" / f
        print(f"  {f:22s} {p.stat().st_size / 1024:8.1f} kB")
    print(f"done: loop length {L - F:.3f}s")


if __name__ == "__main__":
    main()
