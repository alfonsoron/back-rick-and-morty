import { Request } from 'express';

export type AuthenticatedRequest = Request & {
  user: {
    sub: string;
    mail: string;
    role: string;
  };
};
