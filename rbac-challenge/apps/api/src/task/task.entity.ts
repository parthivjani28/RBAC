import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 'Todo' })
  status: string; // Todo, In Progress, Done

  @Column({ nullable: true })
  category: string; // Work, Personal, etc.

  @ManyToOne(() => User)
  createdBy: User;

  @ManyToOne(() => Organization)
  organization: Organization;
}
