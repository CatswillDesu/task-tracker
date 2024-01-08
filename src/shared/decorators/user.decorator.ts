import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/auth/auth.guard';

export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as User;
  },
);
