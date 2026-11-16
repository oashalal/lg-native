const GAME_ORIGIN = 'https://legiongame.gg';

/** Restore the browser-supplied origin only for requests initiated by the game. */
export function restoreGameApiOrigin(request: Request & { initiatorOrigin?: string | null | undefined }, headers: Record<string, string>): void {
  const url = new URL(request.url);
  if (url.origin !== GAME_ORIGIN || !/^\/(?:api\/|c\/[^/]+\/api\/)/.test(url.pathname)) return;
  if (request.method === 'GET' || request.method === 'HEAD' || request.initiatorOrigin !== GAME_ORIGIN) return;
  if (!Object.keys(headers).some((name) => name.toLowerCase() === 'origin')) headers.origin = GAME_ORIGIN;
}
