import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserRepository from '../../repository/UserRepository';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authMiddleware = (userRepository: UserRepository) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token inválido.' });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Token inválido.' });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as unknown as {
        userId: string;
      };
      const { userId } = decoded;

      const user = await userRepository.findById(userId);
      if (!user) {
        return res.status(401).json({ message: 'Token inválido.' });
      }

      req.userId = userId;

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido.' });
    }
  };
};
