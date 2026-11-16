export function run(LGX: { ready: (feature: string) => Promise<unknown> }): void {
  void LGX.ready('global:LGLive').catch(() => undefined);
}
