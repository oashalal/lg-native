/* global LGX */
/* Runs in Chromium's network isolated world; response is data, never code. */
const endpoint = 'https://api.example.com/status'; // Must match patch.json exactly.
void (async () => {
  try {
    const data = await LGX.net.json(endpoint);
    // Keep returned JSON as data. Never evaluate or insert it as HTML.
    LGX.log('my-network-patch', JSON.stringify(data).slice(0, 16_000));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'request-failed';
    LGX.log('my-network-patch', `Request failed: ${message.slice(0, 300)}`);
  }
})();
