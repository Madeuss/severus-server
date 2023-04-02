import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service'
import { IsPublic } from 'src/auth/decorators/is-public.decorator'
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard'
import { AuthRequest } from 'src/auth/models/AuthRequest'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@Request() req: AuthRequest) {
    return this.authService.login(req.user)
  }
}
