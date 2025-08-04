import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,
  ) {}

  
async create(dto: CreateOrganizationDto) {
  const org = new Organization();
  org.name = dto.name;

  if (dto.parent) {
    const parentOrg = await this.orgRepo.findOne({ where: { id: dto.parent } });
    if (!parentOrg) {
      throw new Error('Parent organization not found');
    }
    org.parent = parentOrg;
  }

  return this.orgRepo.save(org);
}


  findAll() {
    return this.orgRepo.find({ relations: ['parent', 'children'] });
  }

  findOne(id: number) {
    return this.orgRepo.findOne({ where: { id }, relations: ['parent', 'children'] });
  }

  
async update(id: number, dto: CreateOrganizationDto) {
  const org = await this.orgRepo.findOne({ where: { id } });
  if (!org) {
    throw new Error('Organization not found');
  }

  org.name = dto.name;

  if (dto.parent) {
    const parentOrg = await this.orgRepo.findOne({ where: { id: dto.parent } });
    if (!parentOrg) {
      throw new Error('Parent organization not found');
    }
    org.parent = parentOrg;
  } else {
    org.parent = null;
  }

  return this.orgRepo.save(org);
}


  remove(id: number) {
    return this.orgRepo.delete(id);
  }
}
