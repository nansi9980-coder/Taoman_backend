import { Controller, Get, Post, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getReports() {
    return this.reportsService.findAll();
  }

  @Post()
  async generateReport(@Body() body: { name: string; type: string }) {
    return this.reportsService.generateReport(body.name, body.type);
  }

  @Delete(':id')
  async deleteReport(@Param('id', ParseIntPipe) id: number) {
    return this.reportsService.delete(id);
  }
}
