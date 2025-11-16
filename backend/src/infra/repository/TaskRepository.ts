import Task from '../../domain/entity/Task';

export default interface TaskRepository {
  save(task: Task): Promise<void>;
  update(task: Task, userId: string): Promise<void>;
  delete(task: Task, userId: string): Promise<void>;
  findAll(
    userId: string,
    page: number,
    limit: number,
  ): Promise<[Task[], number]>;
  findById(id: string, userId: string): Promise<Task | null>;
}
