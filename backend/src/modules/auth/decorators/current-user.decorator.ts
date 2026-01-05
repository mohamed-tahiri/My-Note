import { User } from '@/modules/users/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request & { user: User }>();
    if (!request.user) {
      return null;
    }

    return data ? request.user[data] : request.user;
  },
);
