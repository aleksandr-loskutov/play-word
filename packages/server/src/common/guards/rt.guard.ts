import { AuthGuard } from '@nestjs/passport';

export default class RtGuard extends AuthGuard('jwt-refresh') {}
