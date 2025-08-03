import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { TaskModule } from '../task/task.module';
import { OrganizationModule } from  './organization/organization.module';

import { User } from '../entities/user.entity';
import { Task } from '../entities/task.entity';
import { Organization } from '../entities/organization.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'rbac.sqlite',
      entities: [User, Task, Organization],
      synchronize: true,
    }),

    AuthModule,
    TaskModule,
    OrganizationModule,
  ],
})
export class AppModule {}
