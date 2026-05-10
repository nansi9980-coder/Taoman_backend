import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('services')
  getServiceCards() { return this.contentService.getServiceCards(); }

  @Post('services')
  @UseGuards(JwtAuthGuard)
  createServiceCard(@Body() body: any) { return this.contentService.createServiceCard(body); }

  @Put('services/:id')
  @UseGuards(JwtAuthGuard)
  updateServiceCard(@Param('id') id: string, @Body() body: any) { return this.contentService.updateServiceCard(+id, body); }

  @Delete('services/:id')
  @UseGuards(JwtAuthGuard)
  deleteServiceCard(@Param('id') id: string) { return this.contentService.deleteServiceCard(+id); }

  @Get('texts')
  getSiteContents() { return this.contentService.getSiteContents(); }

  @Get('texts/:section')
  getSiteContentBySection(@Param('section') section: string) { return this.contentService.getSiteContentBySection(section); }

  @Post('texts')
  @UseGuards(JwtAuthGuard)
  upsertSiteContent(@Body() body: { section: string, content: string }) {
    return this.contentService.upsertSiteContent(body.section, body.content);
  }
}