# task manager

## Author

| Roll No. | Name | GitHub username |
|---|---|---|
| 24ESKCS048 | Ankit kumar | Ankitj3345|

## About

This Task Management System is a simple web application used to manage and display information about tasks. It allows users to add new tasks, search for tasks, mark tasks as completed, and navigate between different sections. The project uses HTML, CSS, JavaScript, Bootstrap, Node.js (Express), Docker, Prometheus, and Kubernetes for development, containerization, monitoring, and orchestration.

## Tech stack

- Frontend: HTML, CSS, JavaScript, Bootstrap
- Backend: Node.js (Express)
- Containerization: Docker, Docker Compose
- Orchestration: Kubernetes (kind/k3d)
- Monitoring: Prometheus, Grafana
- CI/CD: GitHub Actions, Jenkins

## Running locally

```bash
make install
make run
```

Or using npm directly:

```bash
npm install
npm start
```

The application runs locally on `http://localhost:3000`.

## Live Demo

https://mortgages-increase-hazards-eddie.trycloudflare.com

Backup / GitHub Pages: https://ankitj3345.github.io/Task-Manager/

## Live URL

https://mortgages-increase-hazards-eddie.trycloudflare.com

## Docker Containerization (M5)

- Container Image on Docker Hub: `ankitj3345/task-manager:latest`
- Registry URL: https://hub.docker.com/r/ankitj3345/task-manager

Build and run with Docker:

```bash
docker build -t ankitj3345/task-manager:latest .
docker run -d -p 3000:3000 --name task-manager ankitj3345/task-manager:latest
```

Or using Docker Compose:

```bash
docker compose up --build
```

## Monitoring & Metrics (M6)

- Prometheus Scrape Config: `monitoring/prometheus.yml`
- Grafana Dashboard: `monitoring/dashboard.json`
- Metrics Endpoint: `GET /metrics` (exposes Prometheus metrics using prom-client including request counts, latency histogram, CPU, memory, and application health status).

## Kubernetes Orchestration (M7)

Deploy to a local Kubernetes cluster (kind or k3d):

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

Verify deployment and pods:

```bash
kubectl get deployments
kubectl get pods
kubectl get services
```

- Deployment manifest: `k8s/deployment.yaml` (2 replicas, liveness & readiness probes, resource limits)
- Service manifest: `k8s/service.yaml` (NodePort exposing port 3000 on nodePort 30080)
- Verified pods screenshot: `docs/kubernetes-pods.png`
- Deployed application screenshot: `docs/deployment.png`

## Health endpoint

`GET /health` returns the running commit SHA:
```
0a745422cd3a2c56976110332581d8721b2cc5da
```
When called with `Accept: application/json`, it returns JSON health status:
```json
{
  "status": "UP",
  "commit": "0a745422cd3a2c56976110332581d8721b2cc5da",
  "uptime": 120,
  "timestamp": "2026-10-12T06:55:00.000Z"
}
```