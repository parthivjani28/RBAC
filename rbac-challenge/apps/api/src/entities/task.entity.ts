import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 'Todo' })
  status: string;

  @Column({ nullable: true })
  category: string;

  @ManyToOne(() => User)
  createdBy: User;

  @ManyToOne(() => Organization)
  organization: Organization;
}
