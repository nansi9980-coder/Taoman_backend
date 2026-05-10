import { Injectable, Logger } from '@nestjs/common';

import { Resend } from 'resend';

@Injectable()

export class MailService {

  private readonly logger = new Logger(MailService.name);
  private readonly resend?: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY is not set. Email sending will be disabled.');
      return;
    }

    this.resend = new Resend(apiKey);
  }

  async sendOtp(email: string, otp: string) {
    if (!this.resend) {
      this.logger.warn(`Skipping OTP email to ${email}: Resend API key is missing.`);
      return;
    }

    await this.resend.emails.send({
      from: 'your-email@example.com',
      to: email,
      subject: 'Your OTP',
      html: `<p>Your OTP is: ${otp}</p>`,
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    if (!this.resend) {
      this.logger.warn(`Skipping email to ${to}: Resend API key is missing.`);
      return;
    }

    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html,
    });
  }
}