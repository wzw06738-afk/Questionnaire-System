import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { StatModule } from './stat/stat.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wenjuan'),
    AuthModule,
    QuestionModule,
    AnswerModule,
    StatModule,
    AiModule,
  ],
})
export class AppModule {}
