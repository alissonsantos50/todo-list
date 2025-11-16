import TaskRepository from '../../infra/repository/TaskRepository';

export default class EditTask {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: EditTaskInput): Promise<void> {
    const task = await this.taskRepository.findById(input.id, input.userId);
    if (!task) throw new Error('Tarefa não encontrada');

    if (
      (!input.title && typeof input.finished !== 'boolean') ||
      (input.title === task.title && input.finished === task.finished)
    ) {
      return;
    }

    if (input.title && task.title !== input.title) {
      task.changeTitle(input.title.trim());
    }

    if (
      typeof input.finished === 'boolean' &&
      task.finished !== input.finished
    ) {
      input.finished ? task.finish() : task.unfinish();
    }

    await this.taskRepository.update(task, input.userId);
  }
}

type EditTaskInput = {
  id: string;
  title: string;
  finished: boolean;
  userId: string;
};
