import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BackupsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.backup.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async runBackup() {
    // Dans un cas réel, exécuter pg_dump ici
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    return this.prisma.backup.create({
      data: {
        name: `Sauvegarde Complète ${dateStr}`,
        size: 5.0, // Valeur fictive
        type: 'complete',
        status: 'success',
        duration: '10 min',
      },
    });
  }

  async delete(id: number) {
    return this.prisma.backup.delete({ where: { id } });
  }
}
