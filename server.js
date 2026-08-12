const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const clients = [];

// Watch directory for live changes
fs.watch(__dirname, { recursive: true }, (eventType, filename) => {
  if (filename && !filename.includes('.git') && !filename.includes('node_modules')) {
    clients.forEach(res => {
      try { res.write('data: reload\n\n'); } catch (e) {}
    });
    clients.length = 0;
  }
});

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.webm': 'video/webm'
};

const server = http.createServer((req, res) => {
  if (req.url === '/live-events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    clients.push(res);
    return;
  }

  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('404 Not Found');
      return;
    }

    if (contentType === 'text/html') {
      const liveScript = `
        <script>
          (function() {
            const evtSource = new EventSource('/live-events');
            evtSource.onmessage = function(e) {
              if (e.data === 'reload') {
                console.log('[LiveServer] Live reload triggered by server file change.');
                window.location.reload();
              }
            };
          })();
        </script>
      `;
      content = Buffer.from(content.toString().replace('</body>', `${liveScript}\n</body>`));
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`[LiveServer] Live server running on http://localhost:${PORT}`);
});
