const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightReady(str) {
  return str.replace(/1\/1\s+Running/g, '<span class="ready">1/1     Running</span>');
}

function run() {
  const docsDir = path.join(__dirname, '..', 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

  console.log(`Using browser executable: ${executablePath}`);

  // 1. Capture deployed application screenshot
  console.log('Capturing deployment.png from http://localhost:3000...');
  const deployPng = path.join(docsDir, 'deployment.png');
  execSync(`"${executablePath}" --headless --disable-gpu --window-size=1280,800 --screenshot="${deployPng}" "http://localhost:3000"`, { stdio: 'inherit' });
  console.log('Saved docs/deployment.png');

  // 2. Capture authentic kubectl get pods screenshot
  console.log('Executing kubectl commands...');
  const kubectlPods = execSync('kubectl get pods -o wide', { encoding: 'utf-8' });
  const kubectlDeploy = execSync('kubectl get deployments', { encoding: 'utf-8' });
  const kubectlSvc = execSync('kubectl get services', { encoding: 'utf-8' });

  const terminalHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      background-color: #0c1017;
      color: #e6edf3;
      font-family: 'Consolas', 'Cascadia Code', 'Courier New', monospace;
      padding: 24px;
      margin: 0;
    }
    .window {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      overflow: hidden;
    }
    .titlebar {
      background: #21262d;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #30363d;
    }
    .dots {
      display: flex;
      gap: 8px;
      margin-right: 16px;
    }
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .dot.red { background: #ff5f56; }
    .dot.yellow { background: #ffbd2e; }
    .dot.green { background: #27c93f; }
    .title {
      font-size: 13px;
      color: #8b949e;
      font-weight: 600;
    }
    .content {
      padding: 20px 24px;
      font-size: 14px;
      line-height: 1.6;
      white-space: pre;
    }
    .prompt {
      color: #58a6ff;
      font-weight: bold;
    }
    .cmd {
      color: #f0883e;
      font-weight: bold;
    }
    .output {
      color: #c9d1d9;
    }
    .ready {
      color: #3fb950;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="window">
    <div class="titlebar">
      <div class="dots">
        <div class="dot red"></div>
        <div class="dot yellow"></div>
        <div class="dot green"></div>
      </div>
      <div class="title">Kubernetes Cluster (kind: task-manager-cluster) - Pods &amp; Deployments Verification</div>
    </div>
    <div class="content">
<span class="prompt">PS D:\\task-manager3&gt;</span> <span class="cmd">kubectl get deployments</span>
<span class="output">${escapeHtml(kubectlDeploy)}</span>
<span class="prompt">PS D:\\task-manager3&gt;</span> <span class="cmd">kubectl get pods -o wide</span>
<span class="output">${highlightReady(escapeHtml(kubectlPods))}</span>
<span class="prompt">PS D:\\task-manager3&gt;</span> <span class="cmd">kubectl get services</span>
<span class="output">${escapeHtml(kubectlSvc)}</span>
    </div>
  </div>
</body>
</html>`;

  const termHtmlPath = path.join(docsDir, 'terminal.html');
  fs.writeFileSync(termHtmlPath, terminalHtml, 'utf-8');

  console.log('Capturing kubernetes-pods.png...');
  const k8sPng = path.join(docsDir, 'kubernetes-pods.png');
  const fileUrl = 'file:///' + termHtmlPath.replace(/\\/g, '/');
  execSync(`"${executablePath}" --headless --disable-gpu --window-size=1200,600 --screenshot="${k8sPng}" "${fileUrl}"`, { stdio: 'inherit' });
  console.log('Saved docs/kubernetes-pods.png');

  // Clean up temporary terminal HTML
  try {
    fs.unlinkSync(termHtmlPath);
  } catch (e) {}

  console.log('All screenshots captured successfully!');
}

run();
