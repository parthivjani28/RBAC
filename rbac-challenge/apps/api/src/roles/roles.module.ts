import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RolesController } from './roles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  exports: [],
})
export class RolesModule {}