import {
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDataDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(12)
  @Matches(/^[a-z0-9][a-z0-9_]*$/)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  bio?: string;

  @IsOptional()
  @IsIn(['light', 'dark-blue', 'forest'])
  theme?: 'light' | 'dark-blue' | 'forest';

  @IsOptional()
  @IsIn(['en', 'fr', 'es', 'it'])
  language?: 'en' | 'fr' | 'es' | 'it';
}
