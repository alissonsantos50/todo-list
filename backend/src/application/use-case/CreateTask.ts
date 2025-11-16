import Task from '../../domain/entity/Task';
import TaskRepository from '../../infra/repository/TaskRepository';

export default class CreateTask {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: CreateTaskInput): Promise<CreateTaskOutput> {
    if (!input.title || input.title.trim() === '') {
      throw new Error('Título da tarefa é obrigatório');
    }

    const task = Task.create(input.title.trim(), input.userId);
    await this.taskRepository.save(task);
    return {
      id: task.id,
      title: task.title,
      finished: task.finished,
      createdAt: task.createdAt,
    };
  }
}

type CreateTaskInput = {
  title: string;
  userId: string;
};

type CreateTaskOutput = {
  id: string;
  title: string;
  finished: boolean;
  createdAt: Date;
};
