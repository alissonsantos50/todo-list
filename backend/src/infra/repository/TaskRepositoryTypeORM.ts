import TaskRepository from './TaskRepository';
import { DataSource, Repository } from 'typeorm';
import { TaskModel } from '../database/typeorm/model/TaskModel';
import Task from '../../domain/entity/Task';

export default class TaskRepositoryTypeORM implements TaskRepository {
  private readonly taskRepository: Repository<TaskModel>;

  constructor(private readonly dataSource: DataSource) {
    this.taskRepository = dataSource.getRepository(TaskModel);
  }

  async save(task: Task): Promise<void> {
    const model = this.parseDomainToModel(task);
    await this.taskRepository.save(model);
  }

  async findAll(userId: string): Promise<Task[] | []> {
    const models = await this.taskRepository.findBy({ user_id: userId });
    return models.map((model) => this.parseModelToDomain(model));
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    const model = await this.taskRepository.findOneBy({ id, user_id: userId });
    if (!model) return null;
    return this.parseModelToDomain(model);
  }

  async delete(task: Task): Promise<void> {
    await this.taskRepository.delete({ id: task.id, user_id: task.userId });
  }

  async update(task: Task): Promise<void> {
    const model = this.parseDomainToModel(task);
    await this.taskRepository.save(model);
  }

  private parseDomainToModel(task: Task): TaskModel {
    const model = new TaskModel();
    model['id'] = task.id;
    model['title'] = task.title;
    model['finished'] = task.finished;
    model['user_id'] = task.userId;
    model['created_at'] = task.createdAt;
    return model;
  }

  private parseModelToDomain(model: TaskModel): Task {
    return new Task(
      model.id,
      model.title,
      model.finished,
      model.user_id,
      model.created_at,
    );
  }
}
