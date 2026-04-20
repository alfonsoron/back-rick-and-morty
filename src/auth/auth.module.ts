import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthTokenGuard } from './guards/auth-token.guard';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'super-secret-key-change-me'),
      }),
    }),
    forwardRef(() => UserModule),
  ],
  providers: [AuthService, AuthTokenGuard],
  exports: [AuthService, AuthTokenGuard, JwtModule],
})
export class AuthModule {}
