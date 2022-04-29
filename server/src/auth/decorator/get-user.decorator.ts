import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    //to use decorator like this @GetUser('email')
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
