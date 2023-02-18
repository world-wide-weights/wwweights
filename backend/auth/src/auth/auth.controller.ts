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
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';
import { RegisterDTO } from './dtos/register.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { RequestWithDbUser } from './interfaces/request-with-refresh-payload.interface';
import { AuthStatisticsResponse } from './responses/auth-statistics.response';
import { JWKSResponse } from './responses/jwks.response';
import { TokenResponse } from './responses/token.response';

@Controller('auth')
@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterDTO })
  @ApiOperation({ summary: 'Register new users' })
  @ApiConflictResponse({
    description: 'User properties already in use',
  })
  @ApiBadRequestResponse({
    description: 'Malformed dto passed',
  })
  @ApiCreatedResponse({
    description: 'User has been created',
    type: TokenResponse,
  })
  async register(@Body() registerData: RegisterDTO): Promise<TokenResponse> {
    return new TokenResponse(await this.authService.register(registerData));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDTO })
  @ApiOperation({ summary: 'Login existing users' })
  @ApiUnauthorizedResponse({
    description: 'User credentials are invalid/User has been banned',
  })
  @ApiOkResponse({
    description: 'Authorized',
    type: TokenResponse,
  })
  async login(@Body() loginData: LoginDTO): Promise<TokenResponse> {
    return new TokenResponse(await this.authService.login(loginData));
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: 'Fetch new access token using refresh token' })
  @ApiBearerAuth('refresh_token')
  @ApiOkResponse({
    description: 'Valid refresh token.',
    type: TokenResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid refresh token',
  })
  async getAuthViaRefreshToken(
    @Req() { user }: RequestWithDbUser,
  ): Promise<TokenResponse> {
    return new TokenResponse(await this.authService.getAuthPayload(user));
  }

  @Get('.well-known/jwks.json')
  @ApiOperation({
    summary: 'Get all information about access token RSA public key',
  })
  @ApiOkResponse({ type: JWKSResponse })
  getJWKSInfo(): JWKSResponse {
    return new JWKSResponse({ keys: [this.authService.getJWKSPayload()] });
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get auth statistics' })
  @ApiOkResponse({
    description: 'Returned statistics',
    type: AuthStatisticsResponse,
  })
  @ApiInternalServerErrorResponse({
    description:
      'The server failed to execute the give task. This is most likely due to a db issue',
  })
  async getAuthStatistics(): Promise<AuthStatisticsResponse> {
    return new AuthStatisticsResponse(
      await this.authService.getAuthStatistics(),
    );
  }
}
