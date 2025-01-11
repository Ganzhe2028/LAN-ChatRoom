const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// MongoDB配置
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'chatApp';
const collectionName = 'messages';
let db;

// 连接MongoDB
async function connectToMongo() {
  try {
    console.log('正在连接MongoDB...');
    const client = new MongoClient(mongoUrl);
    await client.connect();
    db = client.db(dbName);
    await db.collection(collectionName).createIndex({ timestamp: -1 });
    console.log('成功连接到MongoDB');
  } catch (err) {
    console.error('MongoDB连接失败:', err);
    process.exit(1);
  }
}

// 保存消息到数据库
async function saveMessage(message) {
  message.timestamp = new Date();
  await db.collection(collectionName).insertOne(message);
}

// 获取最近的消息
async function getRecentMessages(limit = 50) {
  return await db.collection(collectionName)
    .find()
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray();
}

// 静态文件服务
app.use(express.static('.'));

// 连接MongoDB
connectToMongo().then(() => {
  console.log('MongoDB连接成功');
}).catch(err => {
  console.error('MongoDB连接失败:', err);
});

// WebSocket连接处理
wss.on('connection', async (ws) => {
  console.log('新用户已连接');

  try {
    // 获取并发送历史消息
    const history = await getRecentMessages();
    ws.send(JSON.stringify({
      type: 'history',
      messages: history.reverse()
    }));
  } catch (err) {
    console.error('获取历史消息失败:', err);
  }

  ws.on('message', async (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      await saveMessage(parsedMessage);
      broadcast(parsedMessage);
    } catch (err) {
      console.error('保存消息失败:', err);
    }
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
const PORT = 8081;
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
