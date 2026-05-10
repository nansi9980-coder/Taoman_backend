import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const clients = await this.prisma.client.findMany({
      include: { quotes: true },
    });
    const users = await this.prisma.user.findMany({
      where: { role: 'user' },
      include: { quotes: true },
    });
    
    // Map users to look like clients
    const mappedUsers = users.map(u => ({
      id: `user-${u.id}`,
      name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email.split('@')[0],
      email: u.email,
      phone: u.phone,
      company: 'Utilisateur Web',
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      quotes: u.quotes,
      isWebUser: true
    }));

    return [...clients, ...mappedUsers];
  }

  findOne(id: number) {
    return this.prisma.client.findUnique({
      where: { id },
      include: { quotes: true },
    });
  }

  create(data: { name: string; email: string; phone?: string; company?: string }) {
    return this.prisma.client.create({ data });
  }

  update(id: number, data: Partial<{ name: string; email: string; phone?: string; company?: string }>) {
    return this.prisma.client.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.client.delete({ where: { id } });
  }
}