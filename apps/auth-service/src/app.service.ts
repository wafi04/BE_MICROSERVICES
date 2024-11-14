import { Injectable } from '@nestjs/common';
import {
  User,
  LoginResponse,
  CreateUserResponse,
} from './interfaces/user.interfaces';

@Injectable()
export class AppService {
  private readonly users: User[] = [];

  async login(data: User): Promise<LoginResponse> {
    const user = this.users.find((u) => u.password === data.password);
    console.log(user);
    if (!user) {
      return { status: 'error', message: 'User not found' };
    }
    return { status: 'success', message: 'Login successful', user };
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findOne(id: number): Promise<User | undefined> {
    return this.users[id];
  }

  async create(data: User): Promise<CreateUserResponse> {
    const newUser = { ...data, id: this.users.length };
    this.users.push(newUser);
    return {
      status: 'success',
      message: 'User created successfully',
      user: newUser,
    };
  }
}
