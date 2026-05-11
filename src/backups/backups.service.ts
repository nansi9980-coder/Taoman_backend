import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BackupsService {
  constructor(private prisma: PrismaService) {}

  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.T]/g, '-').slice(0, 19);
    const backupName = `backup-${timestamp}.json`;
    const backupDir = path.join(process.cwd(), 'backups');
    const backupPath = path.join(backupDir, backupName);

    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

    const data = {
      timestamp: new Date(),
      clients: await this.prisma.client.findMany(),
      quotes: await this.prisma.quote.findMany({ include: { client: true } }),
      appointments: await this.prisma.appointment.findMany(),
      investments: await this.prisma.investment.findMany(),
    };

    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));

    return {
      name: backupName,
      size: (fs.statSync(backupPath).size / 1024 / 1024).toFixed(2) + ' MB',
      path: `/backups/${backupName}`,
      createdAt: new Date()
    };
  }

  async getAllBackups() {
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) return [];
    return fs.readdirSync(backupDir)
      .filter(file => file.endsWith('.json'))
      .map(file => ({
        name: file,
        path: `/backups/${file}`,
        createdAt: fs.statSync(path.join(backupDir, file)).birthtime
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Alias methods for controller
  async findAll() {
    return this.getAllBackups();
  }

  async runBackup() {
    return this.createBackup();
  }

  async delete(id: number) {
    // Delete backup by name/id
    const backups = await this.getAllBackups();
    if (backups[id]) {
      const backupPath = path.join(process.cwd(), 'backups', backups[id].name);
      if (fs.existsSync(backupPath)) {
        fs.unlinkSync(backupPath);
        return { success: true, message: 'Backup deleted' };
      }
    }
    return { success: false, message: 'Backup not found' };
  }
}