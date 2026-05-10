import { Injectable } from '@nestjs/common';

import { Resend } from 'resend';

@Injectable()

export class MailService {

  private resend: Resend;

  constructor() {

    this.resend = new Resend(process.env.RESEND_API_KEY);

  }

  async sendOtp(email: string, otp: string) {

    await this.resend.emails.send({

      from: 'your-email@example.com',

      to: email,

      subject: 'Your OTP',

      html: `<p>Your OTP is: ${otp}</p>`,

    });

  }

  async sendEmail(to: string, subject: string, html: string) {
    if (!process.env.RESEND_API_KEY) {
      console.warn(`Simulating email to ${to}: ${subject}`);
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