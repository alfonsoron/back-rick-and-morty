import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
      user?: unknown;
    }>();
    const token = request.headers['auth-token'];

    if (!token) {
      throw new UnauthorizedException('auth-token header is required');
    }

    const payload = await this.authService.verifyToken(token);
    const user = await this.userService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found for token');
    }

    request.user = {
      sub: user.id,
      mail: user.mail,
      role: user.role,
    };
    return true;
  }
}
