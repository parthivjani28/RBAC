import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Controller('roles')
export class RolesController {
  constructor(
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
  ) {}

  @Post()
  async createRole(@Body() body: { name: string }) {
    const existing = await this.rolesRepo.findOne({ where: { name: body.name } });
    if (existing) {
      throw new BadRequestException('Role already exists');
    }

    const role = this.rolesRepo.create({ name: body.name });
    return this.rolesRepo.save(role);
  }
}