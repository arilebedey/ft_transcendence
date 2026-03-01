export interface Participant {
  id: string;
  name: string;
}

export interface LastMessage {
  content: string;
  createdAt: string;
  senderId: string;
}

export interface Chat {
  id: string;
  createdAt: string;
  updatedAt: string;
  participant: Participant | null;
  lastMessage: LastMessage | null;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  seq: number;
  createdAt: string;
}

export type MessageStatus = "sending" | "sent" | "failed";

export interface LocalMessage extends Message {
  _status?: MessageStatus;
  _tempId?: string;
}

export interface MessagesResponse {
  messages: Message[];
  nextCursor: number | null;
}

export interface NewMessageSocketPayload {
  conversationId: string;
  message: Message;
}
