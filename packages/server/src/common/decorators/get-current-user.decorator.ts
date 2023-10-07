import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtPayloadWithRt } from '../../auth/types';

const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRt | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  }
);

export default GetCurrentUser;
