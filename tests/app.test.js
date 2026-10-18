const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const app = require('../src/app');

describe('DepLens Benchmark Test Suite', () => {
  let server;
  let baseUrl;

  before(async () => {
    await new Promise((resolve) => {
      server = http.createServer(app);
      server.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve) => {
      server.close(resolve);
    });
  });

  test('GET /health returns healthy status', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.status, 'healthy');
  });

  test('GET /metrics returns prometheus metrics', async () => {
    const res = await fetch(`${baseUrl}/metrics`);
    assert.strictEqual(res.status, 200);
    const text = await res.text();
    assert.match(text, /http_requests_total/);
  });

  test('POST /api/auth/register creates user and generates JWT', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'alice_tester',
        email: 'alice@example.com',
        password: 'Password123!',
        role: 'user'
      })
    });

    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.ok(body.token);
    assert.strictEqual(body.user.email, 'alice@example.com');
  });

  test('POST /api/auth/login validates credentials and returns token', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alice@example.com',
        password: 'Password123!'
      })
    });

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.ok(body.token);
  });

  test('GET /api/reports/summary generates report using moment, dayjs, slugify', async () => {
    const res = await fetch(`${baseUrl}/api/reports/summary?title=Quarterly%20Security%20Audit`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.slug, 'quarterly-security-audit');
    assert.ok(body.generatedAt);
    assert.ok(body.expiresAt);
  });

  test('GET /api/files/meta returns mimetype analysis', async () => {
    const res = await fetch(`${baseUrl}/api/files/meta?filename=report.json`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.detectedMime, 'application/json');
  });
});
