const fs = require('fs');
const path = require('path');

// 读取全局配置
const rootDir = path.join(__dirname, '..');
const configPath = path.join(rootDir, 'GLOBAL_CONFIG.json');

if (!fs.existsSync(configPath)) {
  console.error('GLOBAL_CONFIG.json not found in root!');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const LAN_IP = config.LAN_IP;

console.log(`Synchronizing IP: ${LAN_IP}...`);

// 1. 同步到 wenjuan-fe (CRA 使用 REACT_APP_ 前缀)
const feEnvPath = path.join(rootDir, 'wenjuan-fe', '.env');
fs.writeFileSync(feEnvPath, `REACT_APP_LAN_IP=${LAN_IP}\n`);

// 2. 同步到 wenjuan-client (Next.js 使用 NEXT_PUBLIC_ 前缀)
const clientEnvPath = path.join(rootDir, 'wenjuan-client', '.env');
fs.writeFileSync(clientEnvPath, `NEXT_PUBLIC_LAN_IP=${LAN_IP}\n`);

// 3. 同步到 wenjuan-server (NestJS 直接读取或者写入 .env)
const serverEnvPath = path.join(rootDir, 'wenjuan-server', '.env');
fs.writeFileSync(serverEnvPath, `LAN_IP=${LAN_IP}\n`);

console.log('Synchronization complete!');
