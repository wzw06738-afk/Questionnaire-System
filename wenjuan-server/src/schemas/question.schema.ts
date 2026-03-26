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
export class Question extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  desc: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isStar: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: Array, default: [] })
  componentList: any[]; // 存储低代码组件配置列表

  @Prop()
  js: string;

  @Prop()
  css: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
