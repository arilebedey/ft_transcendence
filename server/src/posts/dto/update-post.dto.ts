import { IsString, IsOptional, IsNotEmpty, MaxLength, IsUrl } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @MaxLength(2048)
  link?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  content?: string;
}
