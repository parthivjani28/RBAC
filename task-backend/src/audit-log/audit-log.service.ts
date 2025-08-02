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
    return this.auditRepo.save(entry);
  }
}