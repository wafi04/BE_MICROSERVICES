import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './modules/user.modules';
import { LoginDto, RegisterDto } from './interfaces/user.interfaces';
import * as bcrypt from 'bcrypt';
import { CookieService } from './cookie.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private cookiesService: CookieService,
  ) {}

  async register(data: RegisterDto) {
    try {
      const user = new this.userModel(data);
      await user.save();

      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new UnauthorizedException('Username or email already exists');
      }
      throw error;
    }
  }

  async login(data: LoginDto) {
    try {
      const user = await this.userModel.findOne({ username: data.username });
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const tokens = this.cookiesService.generateTokens({
        email: user.email,
        sub: user.id,
      });

      // Return the user object or any other relevant information
      return tokens;
    } catch (error) {
      this.logger.error('Error in login', error);

      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to login');
      }
    }
  }
  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userModel.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return {
        status: 'success',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          roles: user.roles,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async findAll() {
    const users = await this.userModel.find().select('-password');
    return users;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
