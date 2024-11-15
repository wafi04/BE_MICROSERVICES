// apps/api-gateway/src/app.controller.ts
import {
  Body,
  Controller,
  Post,
  Inject,
  HttpException,
  HttpStatus,
  Get,
  Req,
  UseGuards,
  Res,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CookieService } from 'apps/auth-service/src/cookie.service';
import {
  AuthenticatedRequest,
  CreateUserResponse,
  UserData,
} from 'apps/auth-service/src/interfaces/user.interfaces';
import { Response } from 'express';
import { Public } from 'libs/common/decorator/public.decorator';
import { AuthGuard } from 'libs/common/guards/auth.guards';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AppController {
  private logger = new Logger(AppController.name);
  constructor(
    @Inject('AUTH_SERVICE') private authService: ClientProxy,
    private cookieService: CookieService,
  ) {}

  @Public()
  @Post('login')
  async login(
    @Body() data: { username: string; password: string },
    @Res() res: Response,
  ) {
    this.logger.log(data);
    const { password, username } = data;
    const tokens = await firstValueFrom(
      this.authService.send(
        { cmd: 'login' },
        {
          username,
          password,
        },
      ),
    );
    this.cookieService.setCookies(res, tokens);
    return res.status(200).json({
      tokens,
    });
  }

  @Public()
  @Post('register')
  async register(@Body() data: UserData): Promise<CreateUserResponse> {
    return await firstValueFrom(
      this.authService.send({ cmd: 'register' }, data),
    );
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() request: AuthenticatedRequest) {
    const userId = request.user.sub;
    this.logger.log(userId);

    if (!userId) {
      throw new HttpException(
        'User ID not found in token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const response = await firstValueFrom(
      this.authService.send({ cmd: 'get_user' }, userId),
    );

    return response;
  }
}
