import { IsString, IsNotEmpty, MaxLength, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @MaxLength(2048)
  link: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  content: string;
}
