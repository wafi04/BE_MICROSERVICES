// apps/api-gateway/src/app.controller.ts
import {
  Body,
  Controller,
  Post,
  Get,
  Inject,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateUserResponse,
  LoginResponse,
  User,
} from 'apps/auth-service/src/interfaces/user.interfaces';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AppController {
  constructor(@Inject('AUTH_SERVICE') private authService: ClientProxy) {}

  @Post('login')
  async login(@Body() data: User): Promise<LoginResponse> {
    try {
      return await firstValueFrom(
        this.authService.send({ cmd: 'login' }, data),
      );
    } catch (error) {
      throw new HttpException(
        'Auth service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @Post('register')
  async register(@Body() data: User): Promise<CreateUserResponse> {
    try {
      return await firstValueFrom(
        this.authService.send({ cmd: 'create_user' }, data),
      );
    } catch (error) {
      throw new HttpException(
        'Auth service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @Get('users')
  async getAllUsers(): Promise<User[]> {
    try {
      return await firstValueFrom(
        this.authService.send({ cmd: 'get_users' }, {}),
      );
    } catch (error) {
      throw new HttpException(
        'Auth service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @Get('users/:id')
  async getUser(@Param('id') id: number): Promise<User> {
    try {
      return await firstValueFrom(
        this.authService.send({ cmd: 'get_user' }, id),
      );
    } catch (error) {
      throw new HttpException(
        'Auth service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
