import {
  Controller,
  Body,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from '../db/entities/users.entity';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';
import { SignUpDTO } from './dtos/signup.dto';
import { TokenResponse } from './responses/token.response';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signUpData: SignUpDTO) {
    return plainToInstance(
      UserEntity,
      await this.authService.signup(signUpData),
    );
  }

  @Post('login')
  async login(@Body() loginData: LoginDTO) {
    return plainToInstance(
      TokenResponse,
      await this.authService.login(loginData),
    );
  }
}
