# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

"小w问卷" — 一个问卷调查系统，包含四个子项目的手动 monorepo 结构：

| 目录 | 用途 | 端口 |
|---|---|---|
| `wenjuan-server/` | NestJS 后端 API | 3005 |
| `wenjuan-fe/` | B 端管理后台（React SPA） | 8000 |
| `wenjuan-client/` | C 端问卷填写页（Next.js H5） | 3000 |
| `wenjuan-mock/` | Koa mock 服务器（已被真实后端取代） | 3001 |

## 常用命令

**前提条件**: Node.js v16+, MongoDB 运行于 `127.0.0.1:27017`

每个子项目需要分别 `npm install`。

```bash
# 后端
cd wenjuan-server && npm run start:dev       # 开发模式（watch）
cd wenjuan-server && npm run build           # 编译到 dist/
cd wenjuan-server && npm run test            # 单元测试
cd wenjuan-server && npm run test:e2e        # E2E 测试

# B 端管理后台
cd wenjuan-fe && npm start                   # 开发服务器（含 sync-config，绑定 0.0.0.0:8000）
cd wenjuan-fe && npm run build               # 生产构建
cd wenjuan-fe && npm test                    # 测试
cd wenjuan-fe && npm run lint                # ESLint
cd wenjuan-fe && npm run format              # Prettier

# C 端问卷填写
cd wenjuan-client && npm run dev             # Next.js 开发服务器
cd wenjuan-client && npm run build           # Next.js 生产构建
```

**IP 同步**: 根目录 `GLOBAL_CONFIG.json` 存储 `LAN_IP`，通过 `scripts/sync-config.js` 同步到各子项目的 `.env` 文件。`wenjuan-fe` 和 `wenjuan-server` 的 `prestart` 脚本会自动执行同步。

**Bundle 分析**: `ANALYZER=true npm run build`（仅 wenjuan-fe）

## 技术栈

| 层 | 技术 |
|---|---|
| B 端前端 | React 18, TypeScript, Ant Design 5, Redux Toolkit, redux-undo, react-router-dom v6, Axios, @dnd-kit, recharts, SCSS Modules, Craco |
| C 端前端 | Next.js 13.2 (Pages Router), TypeScript, SCSS Modules |
| 后端 | NestJS 9, TypeScript, Mongoose 6, @nestjs/jwt, @nestjs/passport, passport-jwt, bcryptjs |
| 数据库 | MongoDB, Mongoose ODM（三个集合: `users`, `questions`, `answers`）|
| 代码规范 | ESLint, Prettier（无分号、单引号、2 空格缩进、100 字符行宽）, Husky + commitlint (conventional commits) |

## 架构要点

### 前后端通信

- **B 端** (`wenjuan-fe`): Axios 请求拦截器自动附加 JWT `Bearer` token（来自 `localStorage`）。开发服务器通过 Craco 代理 `/api/*` 到 `http://127.0.0.1:3005`。
- **C 端** (`wenjuan-client`): 服务端渲染通过 `fetch` 直接调用后端 `http://${LAN_IP}:3005`。表单提交使用原生 HTML `<form>` POST 到 Next.js API route `/pages/api/answer.ts`，由其转发到后端。

### API 约定

所有路由前缀 `/api/`。响应格式:
- 成功: `{ errno: 0, data: ... }`
- 错误: `{ errno: -1, msg: "..." }`

### 认证

JWT（secret 硬编码为 `'secretKey'`，24h 过期）。密码用 bcryptjs（10 轮 salt）。`JwtAuthGuard` 保护需要认证的路由，`GET /api/question/:id` 和 `POST /api/answer` 是公开路由。

### 状态管理

Redux Toolkit，三个 slice: `user`, `components`, `pageInfo`。`components` slice 用 `redux-undo` 包装，支持 20 步撤销/重做。

### B 端组件架构

问卷组件位于 `wenjuan-fe/src/components/QuestionComponents/`，每个组件遵循固定文件结构:

```
QuestionXxx/
├── Component.tsx      # 渲染组件
├── PropComponent.tsx  # 属性编辑器（B 端右侧面板）
├── StatComponent.tsx  # 统计视图（可选）
├── interface.ts       # TypeScript 类型定义
└── index.ts           # 导出组件配置（defaultProps、title、类型名）
```

组件按用途分三类:
- **文本展示**: `questionInfo`, `questionTitle`, `questionParagraph`
- **用户输入**: `questionInput`, `questionTextarea`
- **用户选择**: `questionRadio`, `questionCheckbox`

新增问卷组件需要: 创建组件文件夹 → 在 `ComponentConf.ts` 注册 → 添加到对应的分类列表中。
