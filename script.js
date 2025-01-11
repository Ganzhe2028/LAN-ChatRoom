let socket;
let username = '';

// 获取DOM元素
const loginSection = document.querySelector('.login');
const chatSection = document.querySelector('.chat');
const usernameInput = document.getElementById('username');
const loginBtn = document.getElementById('loginBtn');
const messagesDiv = document.querySelector('.messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// 获取DOM元素
const loginForm = document.getElementById('loginForm');
const chatContainer = document.getElementById('chatContainer');

// 检查本地存储中是否有用户名
const storedUser = localStorage.getItem('chatUsername');
if (storedUser) {
  currentUser = storedUser;
  loginForm.classList.add('hidden');
  chatContainer.classList.remove('hidden');
  connectWebSocket();
}

// 登录处理
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  if (username) {
    currentUser = username;
    // 保存用户名到localStorage
    localStorage.setItem('chatUsername', username);
    loginForm.classList.add('hidden');
    chatContainer.classList.remove('hidden');
    connectWebSocket();
  }
});

// 登出处理
function logout() {
  localStorage.removeItem('chatUsername');
  location.reload();
}

// 添加登出按钮
const logoutButton = document.createElement('button');
logoutButton.textContent = '登出';
logoutButton.classList.add('logout-btn');
logoutButton.onclick = logout;
document.querySelector('.container').appendChild(logoutButton);

// 连接WebSocket服务器
function connectWebSocket() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.hostname === 'localhost' 
    ? window.location.hostname 
    : window.location.hostname.split(':')[0];
  const port = window.location.port || (protocol === 'wss:' ? 443 : 8081);
  socket = new WebSocket(`${protocol}//${host}:${port}`);

  socket = new WebSocket(`${protocol}//${host}:${port}`);

  socket.onopen = () => {
    console.log('WebSocket连接已建立');
    addSystemMessage('已连接到聊天室');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'history') {
      // 显示历史消息
      data.messages.forEach(message => {
        displayMessage(message);
      });
    } else {
      // 显示实时消息
      displayMessage(data);
    }
  };

  socket.onclose = () => {
    addSystemMessage('连接已断开');
  };
}

// 发送消息
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const content = messageInput.value.trim();
  if (content && socket) {
    const message = {
      username: currentUser,
      content,
      time: new Date().toLocaleTimeString()
    };
    socket.send(JSON.stringify(message));
    messageInput.value = '';
  }
}

// 显示消息
function displayMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  
  messageElement.innerHTML = `
    <span class="username">${message.username}</span>
    <span class="time">${message.time}</span>
    <div class="content">${message.content}</div>
  `;
  
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// 显示系统消息
function addSystemMessage(content) {
  const message = {
    username: '系统',
    content,
    time: new Date().toLocaleTimeString()
  };
  displayMessage(message);
}
