import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

const CONVERSATION_ID_REGEX =
  /^conv_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

@Injectable()
export class ParseConversationIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!CONVERSATION_ID_REGEX.test(value)) {
      throw new BadRequestException('Invalid conversation ID format');
    }
    return value;
  }
}
