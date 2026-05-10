import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; firstName?: string; lastName?: string; phone?: string }) {
    return this.authService.register(body.email, body.password, body.firstName, body.lastName, body.phone);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('send-otp')
  async sendOtp(@Body() body: { email: string }) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.mailService.sendOtp(body.email, otp);
    return { message: 'OTP sent' };
  }
}