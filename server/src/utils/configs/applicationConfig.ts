

export const APPLICATION_CONFIG = {
  DEBUG_REQUEST: true,
  DEBUG_APPLICATION: true,
  APPLICATION_PORT: 8080,
  EXIT_SIGNALS: ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException'],
  CORS_CONFIG: {
    origin: ['http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://localhost:5173'], //TMP "*" shouldn't be posted
    credentials: true,
    optionSuccessStatus: 200
  }
};