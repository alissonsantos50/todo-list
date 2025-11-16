import IUserRepository from '../../infra/repository/UserRepository';
import IPasswordService from '../../infra/services/PasswordService';

export default class AuthenticateUser {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService,
  ) {}

  async execute(input: AuthenticateUserInput): Promise<AuthenticateUserOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) throw new Error('Invalid credentials');

    const isPasswordValid = await this.passwordService.compare(
      input.password,
      user.getPasswordHash(),
    );
    if (!isPasswordValid) throw new Error('Invalid credentials');

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

type AuthenticateUserInput = {
  email: string;
  password: string;
};

type AuthenticateUserOutput = {
  id: string;
  email: string;
  createdAt: Date;
};
