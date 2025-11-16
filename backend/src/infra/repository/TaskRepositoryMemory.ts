import TaskRepository from './TaskRepository';
import Task from '../../domain/entity/Task';

export default class TaskRepositoryMemory implements TaskRepository {
  private tasks: Task[] = [];

  async save(task: Task): Promise<void> {
    this.tasks.push(task);
  }

  async findAll(
    userId: string,
    page: number,
    limit: number,
  ): Promise<[Task[], number]> {
    const tasks = this.tasks.filter((item) => item.userId === userId);
    const start = (page - 1) * limit;
    const end = start + limit;
    return [tasks.slice(start, end), tasks.length];
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    const task = this.tasks.find(
      (item) => item.id === id && item.userId === userId,
    );
    return task || null;
  }

  async delete(task: Task): Promise<void> {
    this.tasks = this.tasks.filter(
      (item) => item.id !== task.id && item.userId === task.userId,
    );
  }

  async update(task: Task): Promise<void> {
    const index = this.tasks.findIndex(
      (item) => item.id === task.id && item.userId === task.userId,
    );
    if (index !== -1) {
      this.tasks[index] = task;
    }
  }
}
