import assert from 'node:assert/strict';

export function test({ outputs }) {
  const app = outputs.get('/site/app.js');
  assert.ok(app, 'app.js was not checked');
  assert.match(app, /ME = next; nameItems\(ME && ME\.hero\); if \(window\.LGX\) \{ window\.LGX\.expose\('api', api\); window\.LGX\.expose\('ME', ME\); \}/);
}
