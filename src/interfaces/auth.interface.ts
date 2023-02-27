/* eslint-disable @typescript-eslint/no-empty-interface */
import type { Request } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
export interface RequestWithUser extends Request {
  auth?: unknown;
}

export interface AuthJwtPayload extends JwtPayload {
  userId: string;
  role?: ROLE;
}

export enum ROLE {
  ADMIN = 0,
  USER = 1,
}
