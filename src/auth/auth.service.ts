import { Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async validateUser(mail: string, password: string) {
    const user = await this.userService.findByMail(mail);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async generateToken(userId: string, mail: string) {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '7d');

    return this.jwtService.signAsync(
      {
        sub: userId,
        mail,
      },
      {
        expiresIn: expiresIn as never,
      },
    );
  }

  async verifyToken(token: string) {
    try {
      return await this.jwtService.verifyAsync<{ sub: string; mail: string }>(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
