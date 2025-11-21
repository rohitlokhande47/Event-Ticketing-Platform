import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() body: { name: string; email: string; password: string }
  ) {
    try {
      return await this.authService.signup(body.name, body.email, body.password);
    } catch (error) {
      throw error;
    }
  }

  @Post('signin')
  async signin(@Body() body: { email: string; password: string }) {
    try {
      return await this.authService.signin(body.email, body.password);
    } catch (error) {
      throw error;
    }
  }
}
