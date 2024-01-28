import { Module } from '@nestjs/common'
import { PostController } from './post.controller'
import { PostService } from './post.service'
import { LikeService } from './like.service'
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [PostController],
  providers: [PostService, LikeService],
})
export class PostModule {}
