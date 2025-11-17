import 'dotenv/config';
import AuthenticateUser from './application/use-case/AuthenticateUser';
import RegisterUser from './application/use-case/RegisterUser';
import AuthController from './infra/controller/AuthController';
import TaskController from './infra/controller/TaskController';
import { ExpressHTTPServerAdapter } from './infra/http/ExpressHTTPServer';
import BcryptPasswordService from './infra/services/BcryptPasswordService';
import { initializeDataSource } from './infra/database/typeorm/DataSource';
import CreateTask from './application/use-case/CreateTask';
import ListTasks from './application/use-case/ListTasks';
import EditTask from './application/use-case/EditTask';
import RemoveTask from './application/use-case/RemoveTask';
import UserRepositoryTypeORM from './infra/repository/UserRepositoryTypeORM';
import TaskRepositoryTypeORM from './infra/repository/TaskRepositoryTypeORM';

async function main() {
  const dataSource = await initializeDataSource();
  const userRepository = new UserRepositoryTypeORM(dataSource);
  const taskRepository = new TaskRepositoryTypeORM(dataSource);
  const httpServer = new ExpressHTTPServerAdapter();
  const passwordService = new BcryptPasswordService();
  const registerUser = new RegisterUser(userRepository, passwordService);
  const authenticateUser = new AuthenticateUser(
    userRepository,
    passwordService,
  );
  const createTask = new CreateTask(taskRepository);
  const listTasks = new ListTasks(taskRepository);
  const editTask = new EditTask(taskRepository);
  const removeTask = new RemoveTask(taskRepository);

  const taskController = new TaskController(
    httpServer,
    createTask,
    listTasks,
    editTask,
    removeTask,
    userRepository,
  );

  const authController = new AuthController(
    httpServer,
    registerUser,
    authenticateUser,
  );

  authController.registerRoutes();
  taskController.registerRoutes();

  httpServer.listen(Number(process.env.PORT) || 3000);
}

main();
