import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
const PdfPrinter = require('pdfmake');

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.quote.findMany({
      include: { client: true, user: true },
    });
  }

  findOne(id: number) {
    return this.prisma.quote.findUnique({
      where: { id },
      include: { client: true, user: true },
    });
  }

  create(data: { title: string; description?: string; amount?: number; clientId: number }) {
    return this.prisma.quote.create({ data });
  }

  update(id: number, data: Partial<{ title: string; description?: string; status?: string; amount?: number }>) {
    return this.prisma.quote.update({
      where: { id },
      data,
    });
  }

  async submitQuote(data: { title: string; description?: string; clientEmail: string; clientName: string; clientPhone?: string }) {
    // Find or create client
    let client = await this.prisma.client.findUnique({
      where: { email: data.clientEmail },
    });

    if (!client) {
      client = await this.prisma.client.create({
        data: {
          name: data.clientName,
          email: data.clientEmail,
          phone: data.clientPhone,
        },
      });
    }

    // Create quote
    return this.prisma.quote.create({
      data: {
        title: data.title,
        description: data.description,
        clientId: client.id,
      },
    });
  }

  remove(id: number) {
    return this.prisma.quote.delete({ where: { id } });
  }

  async generatePdf(id: number): Promise<{ url: string }> {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
      include: { client: true, user: true }
    });

    if (!quote) throw new Error('Quote not found');

    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
      }
    };
    
    const printer = new PdfPrinter(fonts);

    const docDefinition = {
      defaultStyle: {
        font: 'Helvetica'
      },
      content: [
        { text: 'DEVIS', style: 'header' },
        { text: `Taoman Groupe\nLomé, Togo`, margin: [0, 10, 0, 20] },
        { text: `Client: ${quote.client?.name || quote.user?.firstName || 'Client'}` },
        { text: `Email: ${quote.client?.email || quote.user?.email || 'N/A'}` },
        { text: `Téléphone: ${quote.client?.phone || quote.user?.phone || 'N/A'}`, margin: [0, 0, 0, 20] },
        { text: `Service demandé: ${quote.service || quote.title}`, style: 'subheader' },
        { text: `Description:\n${quote.description || 'N/A'}`, margin: [0, 10, 0, 20] },
        { text: `Montant estimé: ${quote.amount ? quote.amount + ' FCFA' : 'Sur devis'}`, style: 'total', margin: [0, 20, 0, 0] },
      ],
      styles: {
        header: { fontSize: 24, bold: true, alignment: 'right' as any },
        subheader: { fontSize: 16, bold: true },
        total: { fontSize: 18, bold: true, color: '#fca311' }
      }
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const fileName = `devis_${id}_${Date.now()}.pdf`;
    const dir = path.join(process.cwd(), 'uploads');
    const filePath = path.join(dir, fileName);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(filePath);
      pdfDoc.pipe(stream);
      pdfDoc.end();

      stream.on('finish', async () => {
        const pdfUrl = `/uploads/${fileName}`;
        await this.prisma.quote.update({
          where: { id },
          data: { pdfUrl, status: 'Envoyé' }
        });
        resolve({ url: pdfUrl });
      });
      stream.on('error', reject);
    });
  }
}
