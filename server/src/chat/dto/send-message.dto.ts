import { IsString, MinLength } from 'class-validator';

export class SendMessageDto {
  @MinLength(1, { message: 'EMPTY_MESSAGE' })
  @IsString({ message: 'NOT_STRING' })
  content: string;
}
