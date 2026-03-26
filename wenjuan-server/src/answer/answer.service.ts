import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Answer } from '../schemas/answer.schema';

@Injectable()
export class AnswerService {
  constructor(@InjectModel(Answer.name) private answerModel: Model<Answer>) {}

  async create(answerData: any) {
    console.log('answerData to be saved:', answerData);
    const answer = new this.answerModel(answerData);
    try {
      const savedAnswer = await answer.save();
      console.log('savedAnswer success:', savedAnswer);
      return savedAnswer;
    } catch (err) {
      console.error('save answer error:', err);
      throw err;
    }
  }

  async findAll(questionId: string, query: { page?: number; pageSize?: number }) {
    const { page = 1, pageSize = 10 } = query;
    const list = await this.answerModel
      .find({ questionId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const total = await this.answerModel.countDocuments({ questionId });
    return { list, total };
  }
}
