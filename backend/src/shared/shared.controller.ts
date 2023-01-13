import { Controller, Get, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVGuard } from './guards/env.guard';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('shared')
export class SharedController {
  constructor(private readonly configService: ConfigService) {}
  @UseGuards(ENVGuard, JwtAuthGuard)
  @Get('info')
  async getInfo() {
    return 'info';
  }
}
