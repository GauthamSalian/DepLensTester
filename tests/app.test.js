const request = require('supertest');
const app = require('../src/app');

describe('DepLens Benchmark Test Suite', () => {
  it('GET /health returns healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('GET /metrics returns prometheus metrics', async () => {
    const res = await request(app).get('/metrics');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('http_request_duration_seconds');
  });

  it('POST /api/auth/register creates user and generates JWT', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'alice_tester',
        email: 'alice@example.com',
        password: 'Password123!',
        role: 'user'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('alice@example.com');
  });

  it('POST /api/auth/login validates credentials and returns token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'alice@example.com',
        password: 'Password123!'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('GET /api/reports/summary generates report using moment, dayjs, slugify', async () => {
    const res = await request(app)
      .get('/api/reports/summary')
      .query({ title: 'Quarterly Security Audit' });

    expect(res.statusCode).toBe(200);
    expect(res.body.slug).toBe('quarterly-security-audit');
    expect(res.body.generatedAt).toBeDefined();
    expect(res.body.expiresAt).toBeDefined();
  });

  it('GET /api/files/meta returns mimetype analysis', async () => {
    const res = await request(app)
      .get('/api/files/meta')
      .query({ filename: 'report.json' });

    expect(res.statusCode).toBe(200);
    expect(res.body.detectedMime).toBe('application/json');
  });
});
