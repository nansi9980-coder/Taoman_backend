import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.log.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async createLog(user: string, action: string, resource: string, status: string, ip: string, details?: string) {
    return this.prisma.log.create({
      data: { user, action, resource, status, ip, details }
    });
  }
}