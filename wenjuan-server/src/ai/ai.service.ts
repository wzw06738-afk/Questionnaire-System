import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Anthropic from '@anthropic-ai/sdk';
import { Question } from '../schemas/question.schema';

const SYSTEM_PROMPT = `你是一个问卷系统助手。用户会描述他们想要的问卷，请根据描述生成问卷组件配置。

你必须返回纯 JSON（不要包含 markdown 代码块标记），格式如下：
{
  "title": "问卷标题",
  "desc": "问卷描述",
  "componentList": [...]
}

支持的组件类型和对应的 props 结构：

1. questionInfo - 问卷信息（每个问卷必须有且仅有一个，放在第一个）
   props: { title: string, desc: string }

2. questionTitle - 标题
   props: { text: string, level: 1|2|3, isCenter?: boolean }

3. questionParagraph - 段落
   props: { text: string, isCenter?: boolean }

4. questionInput - 单行输入
   props: { title: string, placeholder: string }

5. questionTextarea - 多行输入
   props: { title: string, placeholder: string }

6. questionRadio - 单选
   props: { title: string, isVertical: boolean, options: Array<{value: string, text: string}>, value: string }

7. questionCheckbox - 多选
   props: { title: string, isVertical: boolean, list: Array<{value: string, text: string, checked: boolean}>, value: string }

注意：
- componentList 的第一个元素必须是 questionInfo
- 每个组件需要 type、title、props 字段，不需要 fe_id
- options/list 的 value 用英文标识符如 "option1", "item1"
- checkbox 的 checked 默认为 false
- 不要设置 value 的默认值（radio/checkbox 的 value 设为空字符串 ""）`;

function generateFeId(): string {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

@Injectable()
export class AiService {
  constructor(@InjectModel(Question.name) private questionModel: Model<Question>) {}

  async generateAndCreate(userId: string, prompt: string) {
    const client = new Anthropic({
      apiKey: process.env.AI_API_KEY,
      baseURL: process.env.AI_BASE_URL || 'https://token-plan-cn.xiaomimimo.com/anthropic',
    });

    const message = await client.messages.create({
      model: process.env.AI_MODEL || 'mimo-v2-pro',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0];
    const text = content.type === 'text' ? content.text : '';
    // 处理 AI 可能返回的 markdown 代码块
    const jsonStr = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(jsonStr);

    const componentList = (parsed.componentList || []).map(comp => ({
      fe_id: generateFeId(),
      type: comp.type,
      title: comp.title,
      props: comp.props,
    }));

    const question = new this.questionModel({
      title: parsed.title || 'AI 生成的问卷',
      desc: parsed.desc || '',
      author: userId,
      componentList,
    });

    return question.save();
  }
}
