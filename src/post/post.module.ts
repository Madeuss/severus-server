import { Module } from '@nestjs/common'
import { PostController } from './post.controller'
import { PostService } from './post.service'
import { LikeService } from './like.service'
import { PrismaModule } from 'src/prisma/prisma.module'
import { CommentService } from 'src/post/comment.service'

@Module({
  imports: [PrismaModule],
  controllers: [PostController],
  providers: [PostService, LikeService, CommentService],
})
export class PostModule {}
