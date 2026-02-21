export interface NewChatPayload {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  participant: { id: string; name: string };
  lastMessage: null;
}
