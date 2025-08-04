import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Organization } from '../organizations/organization.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto) {
    const { email, password, organizationId, role } = dto;

    const existingUser = await this.userRepo.findOne({
      where: { email },
      relations: ['organization'],
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    if (!org) {
      throw new BadRequestException('Organization not found');
    }

    const roleRepo = this.userRepo.manager.getRepository('Role');
    const roleEntity = await roleRepo.findOne({ where: { name: role } });
    if (!roleEntity) {
      throw new BadRequestException('Role not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      organization: org,
    });

    return this.userRepo.save(user);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, password: hashedPassword });
    return await this.userRepo.save(user);
  }
}
