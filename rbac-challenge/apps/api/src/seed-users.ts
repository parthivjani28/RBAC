import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from './roles/role.entity';
import { Organization } from './organizations/organization.entity';
import { Repository } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const roleRepo = app.get<Repository<Role>>(getRepositoryToken(Role));
  const orgRepo = app.get<Repository<Organization>>(getRepositoryToken(Organization));

  // Ensure roles exist
  const roles = ['Owner', 'Admin', 'Viewer'];
  for (const name of roles) {
    let role = await roleRepo.findOne({ where: { name } });
    if (!role) {
      role = roleRepo.create({ name });
      await roleRepo.save(role);
    }
  }

  // Ensure organization exists
  let org = await orgRepo.findOne({ where: { name: 'DefaultOrg' } });
  if (!org) {
    org = orgRepo.create({ name: 'DefaultOrg' });
    await orgRepo.save(org);
  }

  // Create users
  await usersService.createUser('owner@example.com', 'ownerpass', 'Owner', org);
  await usersService.createUser('admin@example.com', 'adminpass', 'Admin', org);
  await usersService.createUser('viewer@example.com', 'viewerpass', 'Viewer', org);

  console.log('Seeded users: owner@example.com, admin@example.com, viewer@example.com');
  await app.close();
}

bootstrap();
