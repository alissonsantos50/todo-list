import express, { Request, Response, Express, RequestHandler } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import HTTPServer from './HTTPServer';
import openAPIConfig from '../api/OpenAPI';

type ExpressMethods = 'get' | 'post' | 'put' | 'patch' | 'delete';

export class ExpressHTTPServerAdapter implements HTTPServer {
  app: Express;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(openAPIConfig));
  }

  route(
    method: ExpressMethods,
    url: string,
    callback: Function,
    middlewares: RequestHandler[] = [],
  ): void {
    this.app[method](
      url,
      ...middlewares,
      async (req: Request, res: Response) => {
        const context = { userId: (req as any).userId };
        const params = req.params;
        const body = req.body;
        try {
          const { response, statusCode } = await callback(
            params,
            body,
            context,
          );
          res.status(statusCode || 200).json(response);
        } catch (e: any) {
          res.status(422).json({
            message: e.message,
          });
        }
      },
    );
  }

  listen(port: number): void {
    this.app.listen(port);
  }
}
