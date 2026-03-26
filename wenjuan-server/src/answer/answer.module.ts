import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { Answer, AnswerSchema } from '../schemas/answer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Answer.name, schema: AnswerSchema }]),
  ],
  providers: [AnswerService],
  controllers: [AnswerController],
})
export class AnswerModule {}
