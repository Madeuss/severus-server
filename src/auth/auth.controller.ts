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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard'
import { AuthRequest } from 'src/auth/models/AuthRequest'
import { Request as ExpressRequest } from 'express'

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

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req: ExpressRequest) {
    const authHeader = req.headers?.authorization as string | undefined
    const token = authHeader?.split(' ')[1]

    if (token) {
      await this.authService.logout(token)
    }

    return { success: true }
  }
}
