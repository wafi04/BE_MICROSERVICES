import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { User } from './interfaces/user.interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'login' })
  async login(data: User) {
    return this.appService.login(data);
  }

  @MessagePattern({ cmd: 'get_users' })
  async getAll() {
    return this.appService.findAll();
  }

  @MessagePattern({ cmd: 'get_user' })
  getUser(id: number) {
    return this.appService.findOne(id);
  }

  @MessagePattern({ cmd: 'create_user' })
  createUser(data: User) {
    return this.appService.create(data);
  }
}
