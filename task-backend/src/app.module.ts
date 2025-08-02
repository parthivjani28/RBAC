import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { Organization } from './organizations/organization.entity';
import { Task } from './tasks/task.entity';
import { User } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'mydatabase.db',
      entities: [User, Task, Organization],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    TasksModule,
  ],
})
export class AppModule {}
