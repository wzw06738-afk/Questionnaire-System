# 小w问卷 (Wenjuan) - 问卷系统

本项目是一个问卷的全栈项目，包含管理端（B端）、填写端（C端）以及配套的 NestJS 后端和 MongoDB 数据库。

## 🏗️ 项目架构

项目采用多包（Monorepo）结构管理：

- **`wenjuan-fe`**: 管理端（B端）。基于 React + Ant Design + Redux Toolkit 构建。支持问卷编辑（拖拽、属性修改）、发布、统计查看等功能。
- **`wenjuan-client`**: 填写端（C端）。基于 Next.js 构建，负责问卷的 H5 展示和答卷提交。
- **`wenjuan-server`**: 后端服务。基于 NestJS + Mongoose 构建，提供 RESTful API，处理用户认证 (JWT)、问卷 CRUD、答卷收集及统计逻辑。
- **`wenjuan-mock`**: 早期开发使用的 Mock 服务。

## 🚀 快速开始

### 1. 准备工作
确保本地已安装并启动以下环境：
- **Node.js** (推荐 v16+)
- **MongoDB** (默认端口 27017)

### 2. 启动后端 (wenjuan-server)
```bash
cd wenjuan-server
npm install
npm run start
```
后端将运行在 `http://192.168.0.151:3005`。

### 3. 启动管理端 (wenjuan-fe)
```bash
cd wenjuan-fe
npm install
npm start
```
管理端将运行在 `http://192.168.0.151:8000`。

### 4. 启动填写端 (wenjuan-client)
```bash
cd wenjuan-client
npm install
npm run dev
```
填写端将运行在 `http://192.168.0.151:3000`。

## 🛠️ 核心功能

- **问卷编辑器**：支持多种组件（输入框、单选、多选、段落等）的实时编辑、样式调整、图层管理。
- **发布系统**：一键发布问卷，自动生成局域网可访问的 URL 和二维码。
- **答卷收集**：H5 适配的填写页面，支持原生表单提交，数据实时存入 MongoDB。
- **数据统计**：可视化展示答卷数量，提供单项组件的数据分布分析及答卷列表详情。
- **权限管理**：基于 JWT 的登录注册体系，确保问卷数据的私密性与安全性。

## 📝 开发者备注

- **局域网测试**：目前发布 URL 已配置为您的局域网 IP (`192.168.0.151`)，确保同一 WiFi 下的移动设备可以扫码测试。
- **数据库查看**：推荐使用 **MongoDB Compass** 连接 `mongodb://192.168.0.151:27017` 查看 `wenjuan` 数据库下的 `users`、`questions` 和 `answers` 集合。


<img width="1179" height="2556" alt="IMG_2998" src="https://github.com/user-attachments/assets/5dab7bca-51c0-4215-b5f9-cc63cf0c7c99" />

<img width="2559" height="1366" alt="屏幕截图 2026-03-28 110634" src="https://github.com/user-attachments/assets/8586e633-fd19-4781-8870-aa000d2906e8" />
