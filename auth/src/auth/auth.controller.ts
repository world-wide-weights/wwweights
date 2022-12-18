import {
  Controller,
  Body,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from '../db/entities/users.entity';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';
import { SignUpDTO } from './dtos/signup.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { RequestWithRefreshPayload } from './interfaces/request-with-refresh-payload.interface';
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
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginData: LoginDTO) {
    return plainToInstance(
      TokenResponse,
      await this.authService.login(loginData),
    );
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  async getAuthViaRefreshToken(@Req() tokenData: RequestWithRefreshPayload) {
    return plainToInstance(
      TokenResponse,
      await this.authService.getAuthPayload(tokenData.user),
    );
  }

  @Get('.well-known/jwks.json')
  getJWKSInfo() {
    return {};
  }
}
