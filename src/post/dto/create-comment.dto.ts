import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  content: string
}
