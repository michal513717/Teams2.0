import { useCallback, useEffect } from "react";
import { CONFIG } from "./../utils/config";
import { io, Socket } from "socket.io-client";
import { getSessionID, getAccessToken, setSessionID } from "@/stores/localStorage";
import { useChatStorage } from "@/stores/chatStorage";
import { UserStatus } from "@/type/common.types";
import { peerConnection } from "@/utils/globals";
import { useAuthStore } from "@/stores/authStorage";

export const useSocket = () => {
  const { userName } = useAuthStore();
  const { 
    socket, 
    setSocket, 
    setMessages,
    setMessagesWithFormat,
    setChatUsersStatusWithFilter,
    toogleUserStatus
  } = useChatStorage();

  useEffect(() => {
    setupSocketConnection();
  },[]);

  const setupSocketConnection = async () => {
    try {
      const accessToken = getAccessToken();
      const sessionToken = getSessionID();
      const socket = await io(CONFIG.SERVER_URL, {
        auth: {
          token: accessToken,
          sessionID: sessionToken
        }
      });  

      setSocket(socket);

      setupListeners()

    } catch (error) {
      console.log("Error setting up socket connection:", error);
      setSocket(null)
    }
  }

  const setupListeners = useCallback(()=>{
    if(socket === null) return;

    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on(CONFIG.SOCKET_LISTENERS.SESSION_INFO, ({ sessionID, userID }) => {
      setSessionID(sessionID);
      socket.auth = {...socket.auth, sessionID };
    });

    socket.on(CONFIG.SOCKET_LISTENERS.INIT_CHATS, (chatHistory: { from: string; message: string; to: string; timestamp: string }[]) => {
      const formattedMessages = chatHistory.map((msg) => ({
        from: msg.from,
        to: msg.to,
        content: msg.message,
        timestamp: msg.timestamp,
      }));
      setMessages(formattedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
    });

    socket.on(CONFIG.SOCKET_LISTENERS.PRIVATE_MESSAGE, (message: { from: string; message: string; to: string; timestamp: string }) => {
      const formattedMessage = {
        from: message.from,
        to: message.to,
        content: message.message,
        timestamp: message.timestamp,
      };
      setMessagesWithFormat(formattedMessage);
    });

    socket.on(CONFIG.SOCKET_LISTENERS.ALL_USERS, (allUsers: UserStatus[]) => {
      setChatUsersStatusWithFilter(allUsers);
    });

    socket.on(CONFIG.SOCKET_LISTENERS.USER_CONNECTED, (user: string) => {
      toogleUserStatus(user);
    });

    socket.on(CONFIG.SOCKET_LISTENERS.USER_CONNECTED, (user) => {
      toogleUserStatus(user);
    });

    socket.on(CONFIG.SOCKET_LISTENERS.USER_DISCONNECT, (user) => {
      toogleUserStatus(user);
    });

    socket.on(CONFIG.SOCKET_LISTENERS.CALL_MADE, async data => {

      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
      
      socket.emit(CONFIG.SOCKET_EVENTS.CONNECT_WEBRTC, {
        answer,
        to: data.socket
      });
     });


     //TODO Make video container
     socket.on(CONFIG.SOCKET_LISTENERS.RECIVE_WEBRTC_SETTINS, async data => {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
      
      // if (!isAlreadyCalling) {
      //   callUser(data.socket);
      //   isAlreadyCalling = true;
      // }
     });

  }, [socket])

  const sendMessage = (message: string, to: string) => {
    if(socket === null || userName === null) return;
    
    const formattedMessage = {
      from: userName, 
      to, 
      content: message, 
      timestamp: new Date().toISOString()
    };

    setMessagesWithFormat(formattedMessage);
  };


  return { sendMessage };
}