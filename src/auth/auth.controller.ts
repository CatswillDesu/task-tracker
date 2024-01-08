import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { Request } from 'express';
import { Public } from 'src/shared/decorators/public.decorator';
import { RolesGuard } from './roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRoles } from './user.entity';

@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('/profile')
  async getProfile(@Req() req: Request) {
    return this.authService.getProfile(req);
  }

  @Get('/users')
  @Roles(UserRoles.ADMIN)
  async findUsers() {
    return this.authService.findUsers();
  }
}
