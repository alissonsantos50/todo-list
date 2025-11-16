import jwt from 'jsonwebtoken';
import AuthenticateUser from '../../application/use-case/AuthenticateUser';
import RegisterUser from '../../application/use-case/RegisterUser';
import HTTPServer from '../http/HTTPServer';

export default class AuthController {
  constructor(
    private readonly httpServer: HTTPServer,
    private readonly registerUser: RegisterUser,
    private readonly authenticateUser: AuthenticateUser,
  ) {}

  registerRoutes(): void {
    this.httpServer.route(
      'post',
      '/register',
      async (params: unknown, body: { email: string; password: string }) => {
        const input = body;
        if (!input || !input.email || !input.password) {
          throw new Error('Email and password are required');
        }
        const output = await this.registerUser.execute({
          email: input.email,
          password: input.password,
        });
        return { response: output, statusCode: 201 };
      },
    );

    this.httpServer.route(
      'post',
      '/login',
      async (params: unknown, body: { email: string; password: string }) => {
        const input = body;
        if (!input || !input.email || !input.password) {
          throw new Error('Email and password are required');
        }
        const output = await this.authenticateUser.execute({
          email: input.email,
          password: input.password,
        });

        const token = jwt.sign({ userId: output.id }, process.env.JWT_SECRET!, {
          expiresIn: '12h',
        });

        return {
          response: {
            ...output,
            token,
          },
          statusCode: 200,
        };
      },
    );
  }
}
