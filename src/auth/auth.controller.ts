import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service'
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login() {
    // return this.authService.login()
  }
}
