import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
    }
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
    }
  }
})
export class Answer extends Document {
  @Prop({ required: true }) // 暂时去掉 Types.ObjectId 强制校验，因为前端传的是字符串
  questionId: string;

  @Prop({ type: Array, required: true })
  answerList: Array<{
    componentId: string;
    value: any;
  }>;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
