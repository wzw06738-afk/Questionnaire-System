import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from '../schemas/question.schema';

@Injectable()
export class QuestionService {
  constructor(@InjectModel(Question.name) private questionModel: Model<Question>) {}

  async create(author: string) {
    const question = new this.questionModel({
      title: '问卷标题',
      desc: '问卷描述',
      author,
      componentList: [
        {
          fe_id: 'c1',
          type: 'questionInfo',
          title: '问卷信息',
          props: { title: '问卷标题', desc: '问卷描述...' },
        },
      ],
    });
    return question.save();
  }

  async findAll(
    author: string,
    query: { keyword?: string; isStar?: boolean; isDeleted?: boolean; page?: number; pageSize?: number },
  ) {
    const { keyword, isStar, isDeleted, page = 1, pageSize = 10 } = query;
    const filter: any = { author, isDeleted: !!isDeleted };
    if (isStar) filter.isStar = true;
    if (keyword) {
      filter.title = { $regex: keyword, $options: 'i' };
    }

    const list = await this.questionModel
      .find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const total = await this.questionModel.countDocuments(filter);
    return { list, total };
  }

  async findOne(id: string) {
    if (!id || id === 'undefined') return null;
    return this.questionModel.findById(id);
  }

  async update(id: string, updateData: any) {
    return this.questionModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async duplicate(id: string, author: string) {
    const question = await this.questionModel.findById(id);
    const newQuestion = new this.questionModel({
      ...question.toObject(),
      _id: undefined,
      author,
      title: question.title + ' 副本',
    });
    return newQuestion.save();
  }

  async deleteMany(ids: string[], author: string) {
    return this.questionModel.deleteMany({ _id: { $in: ids }, author });
  }
}
