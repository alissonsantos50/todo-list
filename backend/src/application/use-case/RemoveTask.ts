import TaskRepository from '../../infra/repository/TaskRepository';

export default class RemoveTask {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: RemoveTaskInput): Promise<void> {
    const task = await this.taskRepository.findById(input.id, input.userId);
    if (!task) throw new Error('Task not found');
    await this.taskRepository.delete(task, input.userId);
  }
}

type RemoveTaskInput = {
  id: string;
  userId: string;
};
