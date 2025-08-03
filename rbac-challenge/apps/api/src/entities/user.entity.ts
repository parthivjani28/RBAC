import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: 'Owner' | 'Admin' | 'Viewer';

  @ManyToOne(() => Organization, (org) => org.users)
  organization: Organization;
}
