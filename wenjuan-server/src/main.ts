import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 启用 CORS，因为前端会跨域请求
  app.enableCors();

  // 解析 application/x-www-form-urlencoded 格式的数据（C端原生表单提交）
  app.use(bodyParser.urlencoded({ extended: true }));
  // 解析 application/json
  app.use(bodyParser.json());
  
  await app.listen(3005, '0.0.0.0');
  console.log('Application is running on: http://localhost:3005');
}
bootstrap();
