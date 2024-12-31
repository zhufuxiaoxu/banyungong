# BanYungong

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D12.0.0-brightgreen.svg)

我们不生产免费机场，我们只是免费机场的搬运工

## ✨ 功能特点

- 🔄 自动定期更新VPN服务信息
- 📊 按月份展示最新VPN服务数据
- 🔍 智能过滤无效和付费广告信息
- 💾 服务器端数据缓存，提升访问速度
- 🌐 支持跨域访问
- 🔄 内置请求重试机制

## 🛠️ 技术栈

- **后端**: Node.js + Express
- **前端**: Vue.js
- **爬虫**: Axios + Cheerio
- **跨域**: CORS

## 📦 快速开始

### 前置要求

```
Node.js >= v12.0.0
npm 或 yarn
```

### 安装步骤

1. **克隆仓库**

```bash
git clone https://github.com/your-username/project-name.git
cd project-name
```

2. **安装依赖**

```bash
# 安装后端依赖
cd src/server
npm install

# 安装前端依赖
cd ../
npm install
```

3. **配置环境变量（可选）**

创建 `.env` 文件并添加以下配置：
```env
PORT=3000 # 设置服务器端口
```

4. **启动服务**

```bash
# 启动后端服务
cd src/server
node index.js

# 新开终端，启动前端开发服务器
cd 项目根目录
npm run serve
```

## 📁 项目结构

```
src/
├── server/
│   ├── index.js    # 服务器入口文件
│   └── crawler.js  # 爬虫逻辑实现
├── components/
│   └── VPNList.vue # VPN列表组件
└── App.vue         # 主应用组件
```

## 💡 主要功能说明

### 后端服务 (index.js)
- 提供 REST API 接口
- 实现数据缓存机制
- 每24小时自动更新数据
- 支持自动查找可用端口
- 内置错误处理机制

### 爬虫模块 (crawler.js)
- 支持按月份爬取数据
- 自动提取VPN服务关键信息
- 内置请求重试机制
- 智能过滤无效信息
- 详细的日志记录

### 数据结构

每个VPN项目包含以下信息：
- 标题
- 优惠码
- 价格信息
- 套餐名称
- 流量配额
- 使用期限
- 节点位置
- 协议类型
- 节点数量
- 注册说明
- 更新时间
- 相关链接

## ⚠️ 注意事项

1. 本项目仅供学习和研究使用
2. 请遵守相关法律法规
3. 建议在使用时增加适当的请求延迟，避免对目标站点造成压力
4. 数据仅作参考，请以实际服务为准

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 🤝 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📝 更新日志

### v1.0.0
- 初始版本发布
- 实现基础爬虫功能
- 完成前端展示界面
