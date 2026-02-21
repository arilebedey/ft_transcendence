import { IsString, MaxLength, MinLength } from 'class-validator';

export class SendMessageDto {
  @MaxLength(5000, { message: 'MESSAGE_TOO_LONG' })
  @MinLength(1, { message: 'EMPTY_MESSAGE' })
  @IsString({ message: 'NOT_STRING' })
  content: string;
}
