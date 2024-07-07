import { SessionRecord } from "../models/common.models";


class ChatSessionManager {
  private sessions: Map<string, SessionRecord>;

  constructor(){
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
}

export const chatSessionManager = new ChatSessionManager();