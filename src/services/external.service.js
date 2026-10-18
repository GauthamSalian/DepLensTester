const axios = require('axios');
const fetch = require('node-fetch');
const pLimit = require('p-limit');
const logger = require('../config/logger');

// Axios client instance with default headers
const apiClient = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 5000,
  headers: {
    'User-Agent': 'DepLens-Benchmark-App/1.0',
    Accept: 'application/vnd.github.v3+json'
  }
});

/**
 * Fetch GitHub repo details using axios
 */
const fetchRepoWithAxios = async (owner, repo) => {
  try {
    const response = await apiClient.get(`/repos/${owner}/${repo}`);
    return {
      status: response.status,
      data: {
        name: response.data.name,
        description: response.data.description,
        stars: response.data.stargazers_count,
        forks: response.data.forks_count
      }
    };
  } catch (error) {
    logger.warn(`Axios request error: ${error.message}`);
    return { error: error.message, simulated: true };
  }
};

/**
 * Fetch remote raw JSON using node-fetch
 */
const fetchRawJsonWithFetch = async (url) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      timeout: 4000
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { source: 'node-fetch', data };
  } catch (error) {
    logger.warn(`node-fetch error: ${error.message}`);
    return { error: error.message, simulated: true };
  }
};

/**
 * Perform healthcheck call using axios or node-fetch
 */
const checkHealthWithClient = async (targetUrl) => {
  try {
    const res = await apiClient.get(targetUrl, { timeout: 3000 });
    return {
      statusCode: res.status,
      body: res.data
    };
  } catch (error) {
    logger.warn(`Client health check error: ${error.message}`);
    return { error: error.message, simulated: true };
  }
};

/**
 * Concurrently fetch multiple URLs with rate limiting using p-limit
 */
const batchFetchWithLimit = async (urls, concurrency = 2) => {
  const limit = pLimit(concurrency);
  const tasks = urls.map((url) =>
    limit(async () => {
      logger.info(`Fetching URL with p-limit: ${url}`);
      return fetchRawJsonWithFetch(url);
    })
  );
  return Promise.all(tasks);
};

module.exports = {
  fetchRepoWithAxios,
  fetchRawJsonWithFetch,
  checkHealthWithClient,
  batchFetchWithLimit,
  apiClient
};
