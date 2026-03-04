import { IsInt } from 'class-validator';

export class ToggleLikeDto {
  @IsInt()
  postId: number;
}
