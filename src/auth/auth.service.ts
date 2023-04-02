import { Injectable } from '@nestjs/common'
import { UnauthorizedError } from './errors/unauthorized.error'
import { UserService } from 'src/user/user.service'
import { User } from 'src/user/entities/user.entity'
import { UserPayload } from 'src/auth/models/UserPayload'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { UserToken } from 'src/auth/models/UserToken'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  login(user: User): UserToken {
    // Transform user in a JWT token

    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    }

    const jwtToken = this.jwtService.sign(payload)

    return {
      access_token: jwtToken,
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email)

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        }
      }
    }

    throw new UnauthorizedError(
      'Email address or password provided is incorrect.'
    )
  }
}
