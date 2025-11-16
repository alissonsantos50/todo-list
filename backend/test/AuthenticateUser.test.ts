import AuthenticateUser from '../src/application/use-case/AuthenticateUser';
import RegisterUser from '../src/application/use-case/RegisterUser';
import UserRepositoryMemory from '../src/infra/repository/UserRepositoryMemory';
import BcryptPasswordService from '../src/infra/services/BcryptPasswordService';

test('should authenticate a user and return jwt token', async () => {
  const userRepository = new UserRepositoryMemory();
  const passwordService = new BcryptPasswordService();
  const registerUser = new RegisterUser(userRepository, passwordService);
  await registerUser.execute({
    email: 'fulano@gmail.com',
    password: 'securepassword',
  });

  const authenticateUser = new AuthenticateUser(
    userRepository,
    passwordService,
  );
  const user = await authenticateUser.execute({
    email: 'fulano@gmail.com',
    password: 'securepassword',
  });

  expect(user).toHaveProperty('id');
  expect(user.email).toBe('fulano@gmail.com');
  expect(user).toHaveProperty('createdAt');
});
