import { Body, Controller, Post, Patch, Param } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from 'src/user/dto/update-user.dto'
import { UserService } from './user.service'
import { IsPublic } from 'src/auth/decorators/is-public.decorator'
import { User } from '@prisma/client'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { FollowPayload } from 'src/user/models/FollowPayload'

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

  @Patch('follow')
  followOrUnfollowUser(
    @CurrentUser() user: User,
    @Body() targetUsername: FollowPayload
  ) {
    return this.userService.followOrUnfollowUser(user.id, targetUsername)
  }
}
