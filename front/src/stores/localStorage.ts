const ACCESS_TOKEN_STORAGE_KEY = "access_token";
const REFRESH_TOKEN_STORAGE_KEY = "refresh_token";
const SESSION_STORAGE_KEY = "session_key";
const USER_NAME = "user_name"

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function setAccessToken(accessToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
}

export function removeAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function setRefreshToken(refreshToken: string): void {
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
}

export function removeRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function setSessionKey(sessionKey: string): void {
  localStorage.setItem(SESSION_STORAGE_KEY, sessionKey);
}

export function getSessionKey(): string | null {
  return localStorage.getItem(SESSION_STORAGE_KEY);
}

export function setUserName(name: string): void {
  localStorage.setItem(USER_NAME, name)
}

export function getUserName(): string | null {
  return localStorage.getItem(USER_NAME)
}

export function removeUserName(): void {
  localStorage.removeItem(USER_NAME)
}
