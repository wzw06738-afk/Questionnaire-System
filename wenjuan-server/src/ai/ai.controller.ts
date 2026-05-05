import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @UseGuards(JwtAuthGuard)
  @Post('generate')
  async generate(@Body() body: { prompt: string }, @Request() req) {
    const { prompt } = body;
    if (!prompt || !prompt.trim()) {
      return { errno: -1, msg: '请输入问卷描述' };
    }
    try {
      const question = await this.aiService.generateAndCreate(req.user.userId, prompt);
      return { errno: 0, data: { id: question._id } };
    } catch (err) {
      return { errno: -1, msg: 'AI 生成失败，请稍后重试' };
    }
  }
}
