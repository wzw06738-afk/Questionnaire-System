import { Controller, Post, Body, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post()
  async create(@Body() body: any) {
    console.log('Received body from client:', body); // 增加日志查看原始数据
    await this.answerService.create(body);
    return { errno: 0 };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':questionId')
  async findAll(
    @Param('questionId') questionId: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    const { list, total } = await this.answerService.findAll(questionId, {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });
    return {
      errno: 0,
      data: {
        list: list.map(a => a.toJSON()),
        total,
      },
    };
  }
}
