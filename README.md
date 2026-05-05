#  - Survey System

A full-stack questionnaire / survey platform with an admin panel (B端), a public-facing H5 form (C端), and a NestJS backend.

## Screenshots

| Login | Survey Editor |
|---|---|
| ![Login](https://github.com/user-attachments/assets/458094ea-f1bf-4255-aba2-9fef6014444d) | ![Editor](https://github.com/user-attachments/assets/3a1d1e9f-f788-465a-a77f-7d58c215c918) |

| PC Form | Mobile Form | Statistics |
|---|---|---|
| ![PC](https://github.com/user-attachments/assets/8586e633-fd19-4781-8870-aa000d2906e8) | ![Mobile](https://github.com/user-attachments/assets/5dab7bca-51c0-4215-b5f9-cc63cf0c7c99) | ![Stats](https://github.com/user-attachments/assets/45046991-f97b-4a2d-856b-c25c65db457f) |

## Tech Stack

| Layer | Tech |
|---|---|
| Admin Panel (B端) | React 18, TypeScript, Ant Design 5, Redux Toolkit, react-router-dom v6, @dnd-kit, recharts, SCSS Modules |
| Public Form (C端) | Next.js 13 (Pages Router), TypeScript, SCSS Modules |
| Backend | NestJS 9, Mongoose 6, JWT (Passport), bcryptjs |
| Database | MongoDB |
| Tooling | ESLint, Prettier, Husky, commitlint |

## Project Structure

```
wenjuan-server/    # REST API — auth, question CRUD, answer collection, statistics
wenjuan-fe/        # Admin SPA — drag-and-drop editor, publish, stats dashboard
wenjuan-client/    # Public H5 form — SSR via Next.js, native form POST
scripts/           # Config sync utility (LAN_IP → .env files)
```

## Features

- **Drag-and-drop editor** — build surveys with text, input, textarea, radio, and checkbox components
- **Component layering** — show/hide, lock, reorder, copy, and delete components
- **Undo / Redo** — 20-step history powered by redux-undo
- **One-click publish** — generates a LAN-accessible URL and QR code
- **Answer collection** — mobile-friendly H5 form, native form submission
- **Statistics dashboard** — answer counts, per-component distribution charts, answer list
- **Auth** — JWT-based register/login with bcrypt password hashing
- **Dark mode** — toggle on the login page

## Quick Start

### Prerequisites

- Node.js v16+
- MongoDB running on `127.0.0.1:27017`

### 1. Configure environment

Each sub-project has a `.env.example`. Copy them and fill in your local IP:

```bash
cd wenjuan-server && cp .env.example .env
cd wenjuan-fe && cp .env.example .env
cd wenjuan-client && cp .env.example .env
```

Set `LAN_IP` / `REACT_APP_LAN_IP` / `NEXT_PUBLIC_LAN_IP` to your local IP (`ipconfig` / `ifconfig`). Set `JWT_SECRET` to a long random string.

### 2. Start the backend

```bash
cd wenjuan-server
cp .env.example .env        # then edit values if needed
npm install
npm run start:dev
```

API runs at `http://<LAN_IP>:3005`.

### 3. Start the admin panel

```bash
cd wenjuan-fe
cp .env.example .env
npm install
npm start
```

Admin runs at `http://<LAN_IP>:8000`.

### 4. Start the public form

```bash
cd wenjuan-client
cp .env.example .env
npm install
npm run dev
```

Public form runs at `http://<LAN_IP>:3000`.

## API Overview

All endpoints are prefixed with `/api/`. Response format:

```json
// success
{ "errno": 0, "data": { ... } }
// error
{ "errno": -1, "msg": "error message" }
```

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/user/register` | No | Register |
| POST | `/api/user/login` | No | Login, returns JWT |
| GET | `/api/user/info` | Yes | Get current user |
| POST | `/api/question` | Yes | Create a survey |
| GET | `/api/question` | Yes | List surveys (paginated) |
| GET | `/api/question/:id` | No | Get survey by ID |
| PATCH | `/api/question/:id` | Yes | Update survey |
| POST | `/api/answer` | No | Submit an answer |
| GET | `/api/answer/:questionId` | Yes | List answers |
| GET | `/api/stat/:questionId` | Yes | Get statistics |

## Environment Variables

Each sub-project has a `.env.example` — copy it to `.env` and fill in values:

| Variable | Where | Description |
|---|---|---|
| `LAN_IP` | server | LAN IP for display |
| `JWT_SECRET` | server | JWT signing secret |
| `MONGO_URI` | server | MongoDB connection string |
| `REACT_APP_LAN_IP` | admin | LAN IP for API proxy |
| `NEXT_PUBLIC_LAN_IP` | client | LAN IP for SSR fetch |

## License

[MIT](./LICENSE)
