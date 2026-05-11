import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('public')
  getPublicContent() { return this.contentService.getPublicContent(); }

  @Get('public/:slug')
  getBySlug(@Param('slug') slug: string) { return this.contentService.getBySlug(slug); }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() { return this.contentService.findAll(); }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() data: any) { return this.contentService.create(data); }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() data: any) {
    return this.contentService.update(+id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) { return this.contentService.remove(+id); }
}