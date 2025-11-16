import CreateTask from '../../application/use-case/CreateTask';
import EditTask from '../../application/use-case/EditTask';
import ListTasks from '../../application/use-case/ListTasks';
import RemoveTask from '../../application/use-case/RemoveTask';
import HTTPServer from '../http/HTTPServer';
import { authMiddleware } from '../http/middleware/AuthMiddleware';

export default class TaskController {
  constructor(
    private readonly httpServer: HTTPServer,
    private readonly createTask: CreateTask,
    private readonly listTasks: ListTasks,
    private readonly editTask: EditTask,
    private readonly removeTask: RemoveTask,
  ) {}

  registerRoutes(): void {
    const ensureAuthenticated = [authMiddleware];

    this.httpServer.route(
      'post',
      '/tasks',
      async (
        params: unknown,
        body: { title: string },
        context: { userId: string },
      ) => {
        const input = body;
        const output = await this.createTask.execute({
          title: input.title,
          userId: context.userId,
        });
        return { response: output, statusCode: 201 };
      },
      ensureAuthenticated,
    );

    this.httpServer.route(
      'get',
      '/tasks',
      async (params: unknown, body: unknown, context: { userId: string }) => {
        const output = await this.listTasks.execute({ userId: context.userId });
        return { response: output, statusCode: 200 };
      },
      ensureAuthenticated,
    );

    this.httpServer.route(
      'put',
      '/tasks/:taskId',
      async (
        params: { taskId: string },
        body: { title: string; finished: boolean },
        context: { userId: string },
      ) => {
        const output = await this.editTask.execute({
          id: params.taskId,
          title: body.title,
          finished: body.finished,
          userId: context.userId,
        });
        return { response: output, statusCode: 200 };
      },
      ensureAuthenticated,
    );

    this.httpServer.route(
      'delete',
      '/tasks/:taskId',
      async (
        params: { taskId: string },
        body: unknown,
        context: { userId: string },
      ) => {
        const output = await this.removeTask.execute({
          id: params.taskId,
          userId: context.userId,
        });
        return { response: output, statusCode: 204 };
      },
      ensureAuthenticated,
    );
  }
}
