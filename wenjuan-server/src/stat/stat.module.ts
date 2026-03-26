import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatService } from './stat.service';
import { StatController } from './stat.controller';
import { Answer, AnswerSchema } from '../schemas/answer.schema';
import { Question, QuestionSchema } from '../schemas/question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Answer.name, schema: AnswerSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  providers: [StatService],
  controllers: [StatController],
})
export class StatModule {}
