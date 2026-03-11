export interface NewChatPayload {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  participant: { id: string; name: string; avatarUrl: string | null };
  lastMessage: null;
}
