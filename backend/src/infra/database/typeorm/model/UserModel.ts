import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users', schema: 'todo_app' })
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}
