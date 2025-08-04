import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog) private auditRepo: Repository<AuditLog>,
  ) {}

  async findAll() {
    return this.auditRepo.find({ order: { timestamp: 'DESC' } });
  }

  async log(action: string, userId: number, details?: string) {
    const entry = this.auditRepo.create({ action, userId, details });
    console.log(`[AUDIT] User ${userId} performed '${action}'${details ? `: ${details}` : ''}`);
    const fs = await import('fs');
    const logLine = `${new Date().toISOString()} [AUDIT] User ${userId} performed '${action}'${details ? `: ${details}` : ''}\n`;
    fs.appendFile('audit.log', logLine, (err) => {
      if (err) console.error('Failed to write audit log to file:', err);
    });
    return this.auditRepo.save(entry);
  }
}