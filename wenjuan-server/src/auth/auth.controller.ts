import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/user')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    const { username, password, nickname } = body;
    await this.authService.register(username, password, nickname);
    return { errno: 0 };
  }

  @Post('login')
  async login(@Body() body: any) {
    const { username, password } = body;
    const result = await this.authService.login(username, password);
    return {
      errno: 0,
      data: {
        token: result.token,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getInfo(@Request() req) {
    const user = await this.authService.getUserInfo(req.user.userId);
    return {
      errno: 0,
      data: {
        username: user.username,
        nickname: user.nickname,
      },
    };
  }
}
