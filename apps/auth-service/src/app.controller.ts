import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

export interface ErrorResponse {
  statusCode: number;
  message: string;
}
@Controller()
export class AppController {
  private logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'register' })
  async register(data: { username: string; email: string; password: string }) {
    return this.appService.register(data);
  }

  @MessagePattern({ cmd: 'login' })
  async login(data: { username: string; password: string }) {
    this.logger.log(data);
    const result = await this.appService.login({
      password: data.password,
      username: data.username,
    });
    return result;
  }
  @MessagePattern({ cmd: 'validate_token' })
  async validateToken(token: string) {
    return this.appService.validateToken(token);
  }

  @MessagePattern({ cmd: 'get_users' })
  async getAll() {
    return this.appService.findAll();
  }

  @MessagePattern({ cmd: 'get_user' })
  async getUser(id: string) {
    console.log(id);
    return this.appService.findOne(id);
  }
}
