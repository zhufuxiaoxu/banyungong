const { spawn } = require('child_process');
const path = require('path');

// 启动前端服务
const frontend = spawn('npm', ['run', 'serve'], {
    stdio: 'inherit',
    shell: true
});

// 启动后端服务
const backend = spawn('npm', ['run', 'start'], {
    stdio: 'inherit',
    shell: true
});

// 错误处理
frontend.on('error', (error) => {
    console.error('前端启动错误:', error);
});

backend.on('error', (error) => {
    console.error('后端启动错误:', error);
});

// 进程退出处理
process.on('SIGINT', () => {
    frontend.kill();
    backend.kill();
    process.exit();
}); 