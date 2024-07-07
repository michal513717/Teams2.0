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

  public findSocketIdByUserName(userName: string): null | string {
    const sessions = this.findAllSessions();
  
    for(let i = 0; i<sessions.length; i++){
      if(sessions[i].userName === userName){
        return sessions[i].userID
      }
    }

    return null;
  }
}

export const chatSessionManager = new ChatSessionManager();