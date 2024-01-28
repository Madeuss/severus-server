import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from 'src/user/dto/update-user.dto'
import { User } from '@prisma/client'

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

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany()
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }
}
