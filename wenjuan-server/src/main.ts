import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 启用 CORS，允许所有来源访问（局域网测试）
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 解析 application/x-www-form-urlencoded 格式的数据（C端原生表单提交）
  app.use(bodyParser.urlencoded({ extended: true }));
  // 解析 application/json
  app.use(bodyParser.json());
  
  const LAN_IP = process.env.LAN_IP || '127.0.0.1';
  await app.listen(3005, '0.0.0.0');
  console.log(`Application is running on: http://${LAN_IP}:3005`);
}
bootstrap();
