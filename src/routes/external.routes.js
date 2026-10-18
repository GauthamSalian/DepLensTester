const express = require('express');
const router = express.Router();
const {
  fetchRepoWithAxios,
  fetchRawJsonWithFetch,
  checkHealthWithSuperagent,
  batchFetchWithLimit
} = require('../services/external.service');
const { isValidUrl } = require('../middleware/validation.middleware');

// Proxy GitHub repository stats via axios
router.get('/github/:owner/:repo', async (req, res) => {
  const { owner, repo } = req.params;
  const result = await fetchRepoWithAxios(owner, repo);
  return res.json(result);
});

// Fetch raw JSON payload via node-fetch
router.get('/proxy-json', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl || !isValidUrl(targetUrl)) {
    return res.status(400).json({ error: 'Valid "url" query parameter is required' });
  }

  const result = await fetchRawJsonWithFetch(targetUrl);
  return res.json(result);
});

// Health check an endpoint via superagent
router.get('/healthcheck-endpoint', async (req, res) => {
  const targetUrl = req.query.url || 'http://localhost:3000/health';
  const result = await checkHealthWithSuperagent(targetUrl);
  return res.json(result);
});

// Batch fetch multiple endpoints with concurrency limit
router.post('/batch-fetch', async (req, res) => {
  const { urls, concurrency } = req.body;
  if (!Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: 'Array of URLs is required' });
  }

  const results = await batchFetchWithLimit(urls, concurrency || 2);
  return res.json({ count: results.length, results });
});

module.exports = router;
