import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'tasks', schema: 'todo_app' })
export class TaskModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ default: false })
  finished!: boolean;

  @Column()
  user_id!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}
