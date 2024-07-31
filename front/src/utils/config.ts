
//TODO shoulde be moved to global config

export const CONFIG = {
  SERVER_URL: 'http://localhost:8080',

  END_POINTS: {
    LOGIN_ROUTE: '/auth/login',
    REGISTER_ROUTE: '/auth/register',
    GET_ALL_USERS: '/info/allUsers',
    CHECK_TOKEN: '/auth/tokenCheck',
    ALL_USERS: '/info/allUsers'
  },

  SOCKET_EVENTS: {
    CONNECT_WEBRTC: 'make-answer',
    CALL_USER: 'call-user',
    SEND_PRIVATE_MESSAGE: 'private-message',
    USER_DISCONNECT: 'disconnect',
  },

  SOCKET_LISTENERS: {
    RECIVE_WEBRTC_SETTINS: 'answer-made',
    CALL_MADE: 'call-made',
    SESSION_INFO: 'session',
    INIT_CHATS: 'init-chats',
    PRIVATE_MESSAGE: 'private-message',
    USER_CONNECTED: 'user-connected',
    ALL_USERS: 'all-users',
    USER_DISCONNECT: 'user-disconnected'
  }
}