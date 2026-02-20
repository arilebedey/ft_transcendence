import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  link?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;
}
