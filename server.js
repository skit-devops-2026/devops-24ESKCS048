const express = require('express');
const path = require('path');
const fs = require('fs');
const client = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3000;
const COMMIT_SHA = process.env.COMMIT_SHA || process.env.GIT_COMMIT || '0a745422cd3a2c56976110332581d8721b2cc5da';

// ---------------------------------------------------------
// Prometheus Metrics Setup
// ---------------------------------------------------------
const register = new client.Registry();
client.collectDefaultMetrics({
  register,
  prefix: 'taskmanager_'
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]
});
register.registerMetric(httpRequestDuration);

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});
register.registerMetric(httpRequestsTotal);

const appHealthStatus = new client.Gauge({
  name: 'app_health_status',
  help: 'Application health status: 1 for healthy, 0 for unhealthy'
});
register.registerMetric(appHealthStatus);
appHealthStatus.set(1);

// Metrics collection middleware
app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds + nanoseconds / 1e9;
    const route = req.route ? req.route.path : req.path;
    httpRequestsTotal.inc({ method: req.method, route, status_code: res.statusCode });
    httpRequestDuration.observe({ method: req.method, route, status_code: res.statusCode }, duration);
  });
  next();
});

// ---------------------------------------------------------
// Monitoring & Health Endpoints
// ---------------------------------------------------------
app.get('/metrics', async (req, res) => {
  try {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Health endpoint returns the running commit SHA (per README requirement)
app.get('/health', (req, res) => {
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    res.json({
      status: 'UP',
      commit: COMMIT_SHA,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } else {
    res.type('text/plain').send(`${COMMIT_SHA}\n`);
  }
});

app.get('/healthz', (req, res) => {
  res.json({ status: 'UP', commit: COMMIT_SHA });
});

// ---------------------------------------------------------
// Static Files & Web Routes
// ---------------------------------------------------------
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/script', express.static(path.join(__dirname, 'script')));
app.use('/html', express.static(path.join(__dirname, 'html')));

// Serve index.html on root
app.get('/', (req, res) => {
  if (fs.existsSync(path.join(__dirname, 'index.html'))) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
  }
});

// Fallback static files
app.use(express.static(path.join(__dirname, 'html')));

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Task Manager server running on http://0.0.0.0:${PORT}`);
  console.log(`Commit SHA: ${COMMIT_SHA}`);
  console.log(`Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`Prometheus metrics: http://0.0.0.0:${PORT}/metrics`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  appHealthStatus.set(0);
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  appHealthStatus.set(0);
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
