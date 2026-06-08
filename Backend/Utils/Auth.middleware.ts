import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export interface AuthRequest extends Request {
  userId?: number;
  userIdentifier?: string;
}

export const attachUserFromToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization as string;
  if (!authHeader?.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id?: number; userId?: string };
    if (decoded?.id) {
      req.userId = decoded.id;
    }
    if (decoded?.userId) {
      req.userIdentifier = decoded.userId;
    }
  } catch (err) {
    // Ignore invalid token and continue without user id
  }

  next();
};
