import { IsString } from 'class-validator';

export class CreateChatDto {
  @IsString({ message: 'NOT_STRING' })
  participantId: string;
}
