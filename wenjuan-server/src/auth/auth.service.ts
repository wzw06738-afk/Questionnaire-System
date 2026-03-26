import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string, nickname?: string) {
    console.log('Registering user:', username);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      username,
      password: hashedPassword,
      nickname,
    });
    try {
      const savedUser = await user.save();
      console.log('User registered successfully:', savedUser.username);
      return savedUser;
    } catch (err) {
      console.error('Error registering user:', err);
      throw err;
    }
  }

  async login(username: string, password: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('密码错误');
    }

    const payload = { username: user.username, sub: user._id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async getUserInfo(userId: string) {
    return this.userModel.findById(userId).select('-password');
  }
}
