import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  getAppointments() { return this.calendarService.getAppointments(); }

  @Post()
  createAppointment(@Body() body: any) { return this.calendarService.createAppointment(body); }

  @Put(':id')
  updateAppointment(@Param('id') id: string, @Body() body: any) { return this.calendarService.updateAppointment(+id, body); }

  @Delete(':id')
  deleteAppointment(@Param('id') id: string) { return this.calendarService.deleteAppointment(+id); }
}
