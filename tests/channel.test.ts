import { describe, expect, it, vi } from 'vitest';
import { installChannel } from '../src/runtime/channel.js';

describe('inter-world channel transport', () => {
  it('bridges serialized JSON only between matching patch/tab and opposite worlds', () => {
    const target = new EventTarget() as EventTarget & { postMessage: (data: unknown) => void };
    target.postMessage = (data) => { const event = new Event('message') as MessageEvent; Object.defineProperties(event, { data: { value: data }, source: { value: target } }); target.dispatchEvent(event); };
    vi.stubGlobal('window', target);
    const page = installChannel('p', 'tab', 'page');
    const isolated = installChannel('p', 'tab', 'isolated');
    const receive = vi.fn();
    isolated.on(receive);
    page.send({ ok: true, list: [1, 'x'] });
    expect(receive).toHaveBeenCalledWith({ ok: true, list: [1, 'x'] });
    page.close(); isolated.close(); vi.unstubAllGlobals();
  });

  it('rejects unsupported values, excessive depth, size, and rate', () => {
    const target = new EventTarget() as EventTarget & { postMessage: (data: unknown) => void };
    target.postMessage = (data) => { const event = new Event('message') as MessageEvent; Object.defineProperties(event, { data: { value: data }, source: { value: target } }); target.dispatchEvent(event); };
    vi.stubGlobal('window', target);
    const channel = installChannel('p', 'tab', 'page', { bytes: 8, depth: 2, rate: 2 });
    expect(() => channel.send(undefined)).toThrow('channel-json');
    expect(() => channel.send({ a: { b: { c: 1 } } })).toThrow('channel-depth');
    expect(() => channel.send('x'.repeat(20))).toThrow('channel-too-large');
    channel.send(1); channel.send(2);
    expect(() => channel.send(3)).toThrow('channel-rate-limit');
    channel.close();
    expect(() => channel.send(1)).toThrow('channel-closed');
    vi.unstubAllGlobals();
  });

  it('cleans up listeners and isolates scopes', () => {
    const target = new EventTarget() as EventTarget & { postMessage: (data: unknown) => void };
    target.postMessage = (data) => { const event = new Event('message') as MessageEvent; Object.defineProperties(event, { data: { value: data }, source: { value: target } }); target.dispatchEvent(event); };
    vi.stubGlobal('window', target);
    const page = installChannel('p', 'one', 'page');
    const isolated = installChannel('q', 'one', 'isolated');
    const listener = vi.fn(); isolated.on(listener);
    page.send({ value: 1 });
    expect(listener).not.toHaveBeenCalled();
    page.close(); isolated.close();
    expect(window).toBeDefined();
  });
});
