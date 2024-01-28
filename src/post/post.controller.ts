import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
} from '@nestjs/common'
import { LikeService } from './like.service'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User } from '@prisma/client'
import { PostService } from 'src/post/post.service'
import { CreatePostDto } from 'src/post/dto/create-post.dto'
import { UpdatePostDto } from 'src/post/dto/update-post.dto'

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly likeService: LikeService
  ) {}

  @Post()
  createPost(@Body() createPostDto: CreatePostDto, @CurrentUser() user: User) {
    return this.postService.createPost(user.id, createPostDto)
  }

  @Get()
  getAllPosts() {
    return this.postService.getAllPosts()
  }

  @Get(':postId')
  getPostById(@Param('postId') postId: string) {
    return this.postService.getPostById(postId)
  }

  @Patch(':postId')
  updatePost(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: User
  ) {
    return this.postService.updatePost(postId, user.id, updatePostDto)
  }

  @Delete(':postId')
  deletePost(@Param('postId') postId: string, @CurrentUser() user: User) {
    return this.postService.deletePost(postId, user.id)
  }

  @Post(':postId/like')
  likePost(@Param('postId') postId: string, @CurrentUser() user: User) {
    return this.likeService.likePost(postId, user.id)
  }

  @Delete(':postId/like')
  unlikePost(@Param('postId') postId: string, @CurrentUser() user: User) {
    return this.likeService.unlikePost(postId, user.id)
  }
}
