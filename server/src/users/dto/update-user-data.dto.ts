import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateUserDataDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(['light', 'dark-blue', 'forest'])
  theme?: 'light' | 'dark-blue' | 'forest';

  @IsOptional()
  @IsString()
  language?: string;
}
