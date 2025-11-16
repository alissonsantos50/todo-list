import TaskRepository from '../../infra/repository/TaskRepository';

export default class ListTasks {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: ListTasksInput): Promise<ListTasksOutput> {
    const tasks = await this.taskRepository.findAll(input.userId);
    if (!tasks) return [];
    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      finished: task.finished,
      createdAt: task.createdAt,
    }));
  }
}

type ListTasksInput = {
  userId: string;
};

type ListTasksOutput = {
  id: string;
  title: string;
  finished: boolean;
  createdAt: Date;
}[];
