import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LocalStrategy } from 'src/auth/strategies/local.strategy'
import { UserModule } from 'src/user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy'
import { LoginValidationMiddleware } from 'src/auth/middleware/login-validation.middleware'

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginValidationMiddleware).forRoutes('login')
  }
}
