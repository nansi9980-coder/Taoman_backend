import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; email: string; phone?: string; subject: string; message: string }) {
    return this.prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
      },
    });
  }

  async findAll() {
    return this.prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.contact.findUnique({ where: { id } });
  }

  async update(id: number, data: Partial<{ name: string; email: string; phone: string; subject: string; message: string }>) {
    return this.prisma.contact.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.contact.delete({ where: { id } });
  }
}
