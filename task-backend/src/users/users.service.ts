import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import { Organization } from '../organizations/organization.entity';
import { Repository } from 'typeorm';
import { Role } from '../roles/role.entity'; // Make sure this import path is correct

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepo.findOne({
      where: { email },
      relations: ['organization'],
    });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.usersRepo.findOne({
      where: { id },
      
      relations: ['organization', 'role', 'role.permissions'],
    });
  }

  async createUser(
    email: string,
    password: string,
    role: 'Owner' | 'Admin' | 'Viewer',
    organization: Organization
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const roleEntity = await this.rolesRepo.findOne({ where: { name: role } });
    if (!roleEntity) {
      throw new Error(`Role '${role}' not found`);
    }
    const user = this.usersRepo.create({ email, password: hashedPassword, role: roleEntity, organization });
    return this.usersRepo.save(user);
  }
}
