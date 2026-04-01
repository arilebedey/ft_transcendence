import { Injectable } from '@nestjs/common';

@Injectable()
export class PresenceService {
  private readonly userSockets = new Map<string, Set<string>>();
  private readonly socketUsers = new Map<string, string>();

  registerSocket(userId: string, socketId: string) {
    const existingUserId = this.socketUsers.get(socketId);
    if (existingUserId === userId) {
      return { becameOnline: false };
    }

    if (existingUserId && existingUserId !== userId) {
      this.unregisterSocket(socketId);
    }

    this.socketUsers.set(socketId, userId);

    let sockets = this.userSockets.get(userId);
    const wasOnline = !!sockets && sockets.size > 0;

    if (!sockets) {
      sockets = new Set<string>();
      this.userSockets.set(userId, sockets);
    }

    sockets.add(socketId);

    return { becameOnline: !wasOnline };
  }

  unregisterSocket(socketId: string) {
    const userId = this.socketUsers.get(socketId);
    if (!userId) {
      return { userId: null, becameOffline: false };
    }

    this.socketUsers.delete(socketId);

    const sockets = this.userSockets.get(userId);
    sockets?.delete(socketId);

    const isOffline = !sockets || sockets.size === 0;
    if (isOffline) {
      this.userSockets.delete(userId);
    }

    return { userId, becameOffline: isOffline };
  }

  isOnline(userId: string) {
    return (this.userSockets.get(userId)?.size ?? 0) > 0;
  }

  getOnlineUsers(userIds: string[]) {
    return new Set(userIds.filter((userId) => this.isOnline(userId)));
  }
}
