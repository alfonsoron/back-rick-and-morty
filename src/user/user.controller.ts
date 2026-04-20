import { Body, Controller, HttpCode, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { successResponse } from '../common/formatters/api-response';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { presentUser } from './user.presenter';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() payload: RegisterUserDto) {
    const user = await this.userService.register(payload);

    return successResponse('User created successfully', {
      user: presentUser(user),
    });
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() payload: LoginUserDto) {
    const user = await this.authService.validateUser(payload.mail, payload.password);
    const token = await this.authService.generateToken(user.id, user.mail);

    return successResponse('authenticated user', {
      user: presentUser(user),
      token,
    });
  }

  @Put('update')
  @UseGuards(AuthTokenGuard)
  async update(@Body() payload: UpdateUserDto, @Req() request: AuthenticatedRequest) {
    if (request.user.sub !== payload.id) {
      payload.id = request.user.sub;
    }

    const user = await this.userService.update(payload);

    return {
      header: {
        message: 'User successfully updated',
        resultCode: 0,
      },
      user: presentUser(user),
    };
  }
}
