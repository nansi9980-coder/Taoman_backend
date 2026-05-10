import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('logs')
@UseGuards(JwtAuthGuard)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  async getLogs() {
    return this.logsService.findAll();
  }

  @Post()
  async createLog(@Body() body: any) {
    return this.logsService.createLog(body);
  }
}
