// Lightweight Prometheus-compatible metric collector
const metricsData = {
  requestsTotal: 0,
  requestsByStatus: {},
  durations: []
};

const register = {
  contentType: 'text/plain; version=0.0.4; charset=utf-8',
  metrics: async () => {
    let output = '# HELP http_requests_total Total number of HTTP requests\n';
    output += '# TYPE http_requests_total counter\n';
    output += `http_requests_total{app="deplens-benchmark-app"} ${metricsData.requestsTotal}\n\n`;

    output += '# HELP http_request_duration_seconds HTTP request latencies\n';
    output += '# TYPE http_request_duration_seconds summary\n';
    const sum = metricsData.durations.reduce((a, b) => a + b, 0);
    const count = metricsData.durations.length;
    output += `http_request_duration_seconds_sum{app="deplens-benchmark-app"} ${sum.toFixed(4)}\n`;
    output += `http_request_duration_seconds_count{app="deplens-benchmark-app"} ${count}\n`;
    return output;
  }
};

const observeRequest = (method, route, statusCode, durationSec) => {
  metricsData.requestsTotal += 1;
  metricsData.requestsByStatus[statusCode] = (metricsData.requestsByStatus[statusCode] || 0) + 1;
  metricsData.durations.push(durationSec);
  if (metricsData.durations.length > 500) {
    metricsData.durations.shift();
  }
};

module.exports = {
  register,
  observeRequest
};
