import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Answer } from '../schemas/answer.schema';
import { Question } from '../schemas/question.schema';

@Injectable()
export class StatService {
  constructor(
    @InjectModel(Answer.name) private answerModel: Model<Answer>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  async getQuestionStatList(questionId: string, query: { page: number; pageSize: number }) {
    const { page = 1, pageSize = 10 } = query;
    const list = await this.answerModel
      .find({ questionId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const total = await this.answerModel.countDocuments({ questionId });

    // 格式化 list ，把 answerList 拆解到第一层，兼容前端 Table 渲染
    const listWithAnswers = list.map(a => {
      const obj = a.toObject();
      const { answerList = [] } = obj;
      answerList.forEach((item: any) => {
        const { componentId, value } = item;
        obj[componentId] = value;
      });
      return obj;
    });

    return { list: listWithAnswers, total };
  }

  async getComponentStat(questionId: string, componentId: string) {
    const answers = await this.answerModel.find({ questionId });
    
    // 简单的统计逻辑：计算每个选项出现的次数
    const statMap = new Map<string, number>();
    
    answers.forEach(res => {
      const { answerList = [] } = res;
      answerList.forEach(a => {
        if (a.componentId === componentId) {
          const val = a.value;
          if (Array.isArray(val)) {
            // 多选
            val.forEach(v => {
              statMap.set(v, (statMap.get(v) || 0) + 1);
            });
          } else {
            // 单选或输入框
            statMap.set(val, (statMap.get(val) || 0) + 1);
          }
        }
      });
    });

    const stat = Array.from(statMap).map(([name, count]) => ({ name, count }));
    return stat;
  }
}
