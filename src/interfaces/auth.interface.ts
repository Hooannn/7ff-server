/* eslint-disable @typescript-eslint/no-empty-interface */
import type { Request } from 'express';
export interface RequestWithUser extends Request {
  auth?: unknown;
}
