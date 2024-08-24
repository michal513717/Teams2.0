import { Manager } from "../common/manager";
import { SessionRecord } from "../models/common.models";

export class SessionManager extends Manager{
  private sessions!: Record<string, SessionRecord>;

  protected async init(): Promise<void>{
    this.setupLogger("SessionManager");
    this.sessions = {};
    this.finishSetup();
  }

  public findSession(id: string): SessionRecord | null {
    return this.sessions[id] ?? null;
  }

  public saveSession(id: string, session: SessionRecord): void {
    this.sessions[id] = session;
  }

  public findAllSessions(): SessionRecord[] {
    return Object.values(this.sessions);
  }

  public getSessions() {
    return this.sessions;
  }

  public removeSession(socketId: string): void {
    delete this.sessions[socketId];
  }

  public isUserConnectedByUserName(userName: string): boolean {
    return this.findSocketIdByUserName(userName) !== null;
  }

  public isUserConnectedBySocketId(socketId: string): boolean {
    return this.findSession(socketId) !== null;
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