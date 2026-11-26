import { describe, expect, it, vi } from 'vitest';
import { createNet, type NetBridge, type NetResponse } from '../src/runtime/net.js';

function harness(fetchImpl: NetBridge['fetch'] = async () => ({ status: 200, body: '{"ok":true}' })) {
  const cleanups: Array<() => void> = [];
  const abort = vi.fn();
  const bridge: NetBridge = { fetch: vi.fn(fetchImpl), abort };
  const net = createNet(bridge, (cleanup) => cleanups.push(cleanup));
  return { net, bridge, cleanups, abort };
}

describe('createNet', () => {
  it('uses a bridge request ID and returns parsed JSON', async () => {
    const { net, bridge } = harness();
    await expect(net.json('/endpoint')).resolves.toEqual({ ok: true });
    expect(bridge.fetch).toHaveBeenCalledWith('/endpoint', {}, expect.stringMatching(/^lgx-net-/));
  });

  it('rejects unsuccessful and malformed JSON responses', async () => {
    const failed = harness(async () => ({ status: 503, body: '' }));
    await expect(failed.net.json('/')).rejects.toThrow('bad-status:503');
    const malformed = harness(async () => ({ status: 200, body: '{' }));
    await expect(malformed.net.json('/')).rejects.toThrow('invalid-json');
  });

  it('does not send AbortSignal across the bridge and aborts on signal', async () => {
    let resolve!: (value: NetResponse) => void;
    const { net, bridge, abort } = harness(() => new Promise((done) => { resolve = done; }));
    const controller = new AbortController();
    const request = net.fetch('/slow', { signal: controller.signal });
    controller.abort();
    expect(bridge.fetch).toHaveBeenCalledWith('/slow', {}, expect.any(String));
    expect(abort).toHaveBeenCalledOnce();
    resolve({ status: 200, body: '{}' });
    await request;
  });

  it('stops polling, aborts the current request and registers cleanup', async () => {
    let resolve!: (value: NetResponse) => void;
    const { net, bridge, abort, cleanups } = harness(() => new Promise((done) => { resolve = done; }));
    const callback = vi.fn();
    net.poll('/poll', 250, callback);
    expect(bridge.fetch).toHaveBeenCalledOnce();
    cleanups[0]!();
    expect(abort).toHaveBeenCalledOnce();
    resolve({ status: 200, body: '{"ok":true}' });
    await vi.waitFor(() => expect(callback).not.toHaveBeenCalled());
    await new Promise((done) => setTimeout(done, 0));
    expect(bridge.fetch).toHaveBeenCalledOnce();
  });

  it('cleans all active fetches on runtime cleanup', async () => {
    const { net, abort, cleanups } = harness(() => new Promise(() => undefined));
    void net.fetch('/pending');
    cleanups.at(-1)!();
    expect(abort).toHaveBeenCalledOnce();
  });

  it('stopping one poll does not abort another request', () => {
    const { net, bridge, abort } = harness(() => new Promise(() => undefined));
    void net.fetch('/other');
    const stop = net.poll('/poll', 250, () => undefined);
    const calls = vi.mocked(bridge.fetch).mock.calls;
    stop();
    expect(abort).toHaveBeenCalledOnce();
    expect(abort).toHaveBeenCalledWith(calls[1]![2]);
  });
});
