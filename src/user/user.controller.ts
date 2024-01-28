import { Body, Controller, Post, Patch, Get, Query } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from 'src/user/dto/update-user.dto'
import { UserService } from './user.service'
import { IsPublic } from 'src/auth/decorators/is-public.decorator'
import { User } from '@prisma/client'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Patch()
  updateUser(@CurrentUser() user: User, @Body() updatedUserDto: UpdateUserDto) {
    return this.userService.update(user.id, updatedUserDto)
  }

  @Get()
  async getUsers(
    @Query('email') email?: string
  ): Promise<User[] | User | null> {
    if (email) {
      // If email is provided, get a specific user
      return this.userService.findByEmail(email)
    } else {
      // If no email is provided, get all users
      return this.userService.findAll()
    }
  }
}
