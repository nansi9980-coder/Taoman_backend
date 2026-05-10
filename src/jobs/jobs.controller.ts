import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('public')
  findPublished() {
    return this.jobsService.findPublished();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() data: { title: string; category?: string; description: string; skills?: string; location?: string; type?: string; startDate?: string; endDate?: string }) {
    return this.jobsService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() data: Partial<{ title: string; category?: string; description: string; skills?: string; location?: string; type?: string; published: boolean; startDate?: string; endDate?: string }>) {
    return this.jobsService.update(+id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.jobsService.remove(+id);
  }
}