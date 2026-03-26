import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req) {
    const question = await this.questionService.create(req.user.userId);
    return { errno: 0, data: { id: question._id } };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req, @Query() query: any) {
    const { keyword, isStar, isDeleted, page, pageSize } = query;
    const { list, total } = await this.questionService.findAll(req.user.userId, {
      keyword,
      isStar: isStar === 'true',
      isDeleted: isDeleted === 'true',
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });

    return {
      errno: 0,
      data: {
        list: list.map(q => q.toJSON()),
        total,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let question;
    try {
      question = await this.questionService.findOne(id);
    } catch (err) {
      return { errno: -1, msg: '问卷 ID 格式错误或不存在' };
    }

    if (!question) return { errno: -1, msg: '未找到该问卷' };

    return { errno: 0, data: question.toJSON() };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    await this.questionService.update(id, body);
    return { errno: 0 };
  }

  @UseGuards(JwtAuthGuard)
  @Post('duplicate/:id')
  async duplicate(@Param('id') id: string, @Request() req) {
    const question = await this.questionService.duplicate(id, req.user.userId);
    return { errno: 0, data: { id: question._id } };
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteMany(@Body() body: any, @Request() req) {
    const { ids } = body;
    await this.questionService.deleteMany(ids, req.user.userId);
    return { errno: 0 };
  }
}
