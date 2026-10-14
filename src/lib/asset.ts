/**
 * Prefix for files in /public. Empty for `npm run dev` / local builds; set
 * NEXT_PUBLIC_BASE_PATH=/harshgupta when building for GitHub Pages
 * (the deploy workflow does this), because the site is served from a sub-folder.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
