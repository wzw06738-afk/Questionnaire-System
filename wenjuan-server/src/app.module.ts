import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { StatModule } from './stat/stat.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/wenjuan'), // 本地 MongoDB
    AuthModule,
    QuestionModule,
    AnswerModule,
    StatModule,
  ],
})
export class AppModule {}
