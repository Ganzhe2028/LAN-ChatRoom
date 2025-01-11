# 局域网聊天室

这是一个基于 WebSocket 的局域网即时聊天应用，支持多用户实时聊天和用户名设置。
`100%仅依靠cline + deepseek-API`

## 功能特性

- 实时消息传输
- 多用户支持
- 自定义用户名
- 简洁的用户界面
- 自动消息滚动

## 技术栈

- Node.js (Express + WebSocket)
- HTML5 + CSS3
- JavaScript (ES6)

## How to use

1. 克隆仓库：

   ```bash
   git clone https://github.com/Ganzhe2028/LAN-ChatRoom.git
   ```

2. 安装依赖：

   ```bash
   npm install
   ```

3. 启动服务器：

   ```bash
   npm start
   ```

4. 在浏览器中访问：
   ```
   http://localhost:3000
   ```

## 使用说明

1. 打开应用后，输入用户名并点击"加入聊天室"
2. 在消息输入框中输入内容，按回车发送
3. 所有在线用户将实时收到消息
4. 用户加入或离开时会有系统通知

## 注意事项

- 确保所有用户在同一个局域网内
- 默认端口为 3000，可在 server.js 中修改
- 建议使用现代浏览器以获得最佳体验

## 项目结构

```
LAN-ChatRoom/
├── index.html        # 前端页面
├── style.css         # 样式表
├── script.js         # 前端逻辑
├── server.js         # 后端服务器
├── package.json      # 项目配置
└── README.md         # 项目文档
```
