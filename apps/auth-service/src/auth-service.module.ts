import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { User, UserSchema } from './modules/user.modules';
import jwtConfig from 'libs/config/jwt.config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CookieService } from './cookie.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://mongodb:27017/auth',
    ),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
      cache: true,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, ConfigService, CookieService],
})
export class AuthServiceModule {}
