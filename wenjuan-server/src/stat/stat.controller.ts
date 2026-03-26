import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { StatService } from './stat.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':questionId')
  async getQuestionStatList(
    @Param('questionId') questionId: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    const { list, total } = await this.statService.getQuestionStatList(questionId, {
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });

    return {
      errno: 0,
      data: {
        list: list.map((a: any) => {
          // 如果 a 是 Mongoose Document 则调用 toJSON()，否则直接返回
          return a.toJSON ? a.toJSON() : a;
        }),
        total,
      },
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':questionId/:componentId')
  async getComponentStat(
    @Param('questionId') questionId: string,
    @Param('componentId') componentId: string,
  ) {
    const stat = await this.statService.getComponentStat(questionId, componentId);
    return { errno: 0, data: { stat } };
  }
}
