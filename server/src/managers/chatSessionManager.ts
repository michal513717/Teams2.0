import { SessionRecord } from "../models/common.models";


export class ChatSessionManager {
  private sessions: Map<string, SessionRecord>;

  constructor() {
    this.sessions = new Map();
  }

  public findSession(id: string): SessionRecord | null {
    return this.sessions.get(id) ?? null;
  }

  public saveSession(id: string, session: SessionRecord): void {
    this.sessions.set(id, session);
  }

  public findAllSessions(): SessionRecord[] {
    return [...this.sessions.values()];
  }

  public getSessions() {
    return this.sessions;
  }

  public removeSession(socketId: string): void {
    this.sessions.delete(socketId);
  }

  public isUserConnected(userName: string): boolean {
    return this.findSocketIdByUserName(userName) !== null;
  }

  public findSocketIdByUserName(userName: string): null | string {
    const sessions = this.findAllSessions();

    for (const session of sessions) {
      if (session.userName === userName) {
        return session.socketId
      }
    }

    return null;
  }
}

export const chatSessionManager = new ChatSessionManager();