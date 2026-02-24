import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserFromJwt } from '../models/UserFromJwt'
import { UserPayload } from '../models/UserPayload'
import { PrismaService } from 'src/prisma/prisma.service'
import { Request } from 'express'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: UserPayload): Promise<UserFromJwt> {
    const authHeader = req.headers?.authorization as string | undefined
    const token = authHeader?.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException()
    }

    const revoked = await this.prisma.revokedToken.findUnique({
      where: { token },
    })

    if (revoked && revoked.expiresAt > new Date()) {
      throw new UnauthorizedException('Token revoked')
    }

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    }
  }
}
