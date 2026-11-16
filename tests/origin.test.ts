import { describe, expect, it } from 'vitest';
import { restoreGameApiOrigin } from '../src/main/net/origin.js';

describe('game API origin', () => {
  const request = (url: string, initiatorOrigin: string | null | undefined, method = 'POST') => Object.assign(new Request(url, { method }), { initiatorOrigin });
  it('restores the origin for a same-origin game API POST', () => {
    const headers: Record<string, string> = {};
    restoreGameApiOrigin(request('https://legiongame.gg/c/channel/api/chat/watch', 'https://legiongame.gg'), headers);
    expect(headers.origin).toBe('https://legiongame.gg');
  });
  it('does not change other origins, existing headers, or non-API requests', () => {
    for (const origin of [undefined, null, 'https://other.example']) {
      const headers: Record<string, string> = {};
      restoreGameApiOrigin(request('https://legiongame.gg/api/test', origin), headers);
      expect(headers).toEqual({});
    }
    for (const url of ['https://other.example/api/test', 'https://legiongame.gg/auth/login']) {
      const headers: Record<string, string> = {};
      restoreGameApiOrigin(request(url, 'https://legiongame.gg'), headers);
      expect(headers).toEqual({});
    }
    const headers = { Origin: 'null' };
    restoreGameApiOrigin(request('https://legiongame.gg/api/test', 'https://legiongame.gg'), headers);
    expect(headers).toEqual({ Origin: 'null' });
  });
});
