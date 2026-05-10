import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async generateReport(name: string, type: string) {
    // Dans un système réel, on utiliserait puppeteer ou pdfkit ici.
    // Pour l'instant, on crée l'entrée en base de données.
    return this.prisma.report.create({
      data: {
        name,
        type,
        size: '1.5 MB', // Valeur mockée
        status: 'disponible',
        format: 'PDF',
      },
    });
  }

  async delete(id: number) {
    return this.prisma.report.delete({ where: { id } });
  }
}
