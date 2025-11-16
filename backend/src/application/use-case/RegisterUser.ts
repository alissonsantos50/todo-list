import IPasswordService from '../../infra/services/PasswordService';
import IUserRepository from '../../infra/repository/UserRepository';
import User from '../../domain/entity/User';

export default class RegisterUser {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) throw new Error('E-mail já vinculado a outra conta');

    if (!input.password || input.password.trim().length < 6) {
      throw new Error('A senha deve ter no mínimo 6 caracteres');
    }

    const passwordHash = await this.passwordService.hash(input.password);
    const user = User.create(input.email, passwordHash);
    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

type RegisterUserInput = {
  email: string;
  password: string;
};

type RegisterUserOutput = {
  id: string;
  email: string;
  createdAt: Date;
};
