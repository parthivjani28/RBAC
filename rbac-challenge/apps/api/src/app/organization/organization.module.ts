
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../../entities/organization.entity';
// You may also add controllers and services here as you build them
// import { OrganizationService } from './organization.service';
// import { OrganizationController } from './organization.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  // providers: [OrganizationService],
  // controllers: [OrganizationController],
  exports: [TypeOrmModule], // export so other modules can use
})
export class OrganizationModule {}
