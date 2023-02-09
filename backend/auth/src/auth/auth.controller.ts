import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserEntity } from '../db/entities/users.entity';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';
import { SignUpDTO } from './dtos/signup.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { RequestWithRefreshPayload } from './interfaces/request-with-refresh-payload.interface';
import { JWKSResponse } from './responses/jwks.response';
import { TokenResponse } from './responses/token.response';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags()
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiBody({ type: SignUpDTO })
  @ApiOperation({ description: 'Signup new users' })
  @ApiConflictResponse({
    status: HttpStatus.CONFLICT,
    description: 'User properties already in use',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Malformed dto passed',
  })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: 'User has been created',
    type: UserEntity,
  })
  async signup(@Body() signUpData: SignUpDTO): Promise<UserEntity> {
    return await this.authService.signup(signUpData);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDTO })
  @ApiOperation({ description: 'Login existing users' })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User credentials are invalid/User has been banned',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Authorized',
    type: TokenResponse,
  })
  async login(@Body() loginData: LoginDTO): Promise<TokenResponse> {
    return new TokenResponse(await this.authService.login(loginData));
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ description: 'Fetch new access token using refresh token' })
  @ApiBearerAuth('refresh_token')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Valid refresh token.',
    type: TokenResponse,
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.OK,
    description: 'Invalid refresh token',
  })
  async getAuthViaRefreshToken(
    @Req() tokenData: RequestWithRefreshPayload,
  ): Promise<TokenResponse> {
    return new TokenResponse(
      await this.authService.getAuthPayload(tokenData.user),
    );
  }

  @Get('.well-known/jwks.json')
  @ApiOperation({
    description: 'Get all information about access token RSA public key',
  })
  @ApiOkResponse({ type: JWKSResponse })
  getJWKSInfo() {
    return new JWKSResponse({ keys: [this.authService.getJWKSPayload()] });
  }
}
