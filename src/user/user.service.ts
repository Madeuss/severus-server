import { Injectable, InternalServerErrorException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from 'src/user/dto/update-user.dto'
import { FollowPayload } from 'src/user/models/FollowPayload'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const data = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    }

    const createdUser = await this.prisma.user.create({ data })

    return { ...createdUser, password: undefined }
  }

  async update(userId: string, updatedUserDto: UpdateUserDto) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { ...updatedUserDto },
    })

    return { ...updatedUser, password: undefined }
  }

  async followOrUnfollowUser(
    followerId: string,
    { username: targetUsername }: FollowPayload
  ) {
    try {
      const followingUser = await this.prisma.user.findUnique({
        where: { username: targetUsername },
      })
      if (!followingUser) {
        throw new Error(`User with username ${targetUsername} not found`)
      }
      const existingFollow = await this.prisma.follow.findFirst({
        where: {
          followerId,
          followingId: followingUser.id,
        },
      })
      if (existingFollow) {
        const unfollow = await this.prisma.follow.delete({
          where: { id: existingFollow.id },
        })
        return unfollow
      } else {
        const follow = await this.prisma.follow.create({
          data: {
            follower: { connect: { id: followerId } },
            following: { connect: { id: followingUser.id } },
          },
        })
        return follow
      }
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }
}
