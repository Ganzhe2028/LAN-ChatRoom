const WebSocket = require('ws');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 静态文件服务
app.use(express.static('.'));

// WebSocket连接处理
wss.on('connection', (ws) => {
  console.log('新用户已连接');

  // 广播消息给所有客户端
  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    broadcast(parsedMessage);
  });

  ws.on('close', () => {
    console.log('用户已断开连接');
  });
});

function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// 启动服务器
const PORT = 8080;
const HOST = '0.0.0.0';
server.listen(PORT, HOST, () => {
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  const ipAddresses = [];
  
  Object.keys(networkInterfaces).forEach((iface) => {
    networkInterfaces[iface].forEach((details) => {
      if (details.family === 'IPv4' && !details.internal) {
        ipAddresses.push(details.address);
      }
    });
  });

  console.log('服务器正在运行：');
  console.log(`- 本机访问：http://localhost:${PORT}`);
  ipAddresses.forEach((ip) => {
    console.log(`- 局域网访问：http://${ip}:${PORT}`);
  });
});
