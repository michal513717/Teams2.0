import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { getAccessToken } from "@/stores/localStorage";
import { io, Socket } from "socket.io-client";
import { CONFIG } from "@/utils/config";
import { useAuthStore } from "@/stores/authStorage";
import { GLOBAL_CONFIG } from "./../../../config.global";

export const VideoContext = createContext<any | null>(null);

// TODO setup
const { RTCPeerConnection } = window;
export const peerConnection = new RTCPeerConnection();


const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userName } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);


  useEffect(() => {

    const accessToken = getAccessToken();

    if (!accessToken || !userName) {
      console.error("Access token or username is missing");
      return;
    }

    const newSocket = io(CONFIG.SERVER_URL, {
      auth: {
        token: accessToken
      },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });


    //TODO setup
    // const callUser = useCallback(async (socketId: PathString) => {
    //   console.log("callUser")
    //   if (socket === null) return;
    //   console.log("defined")
    //   const offer = await peerConection.createOffer();
    //   await peerConection.setLocalDescription(new RTCSessionDescription(offer));

    //   socket.emit(CONFIG.SOCKET_EVENTS.CALL_USER, {
    //     offer,
    //     to: socketId
    //   })
    // }, [socket])



    newSocket.on("disconnect", () => {
      // TODO remove user
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const callUser = (message: string, to: string) => {
    if (socket) {
      if (userName) {

      } else {
        console.error("User name is null");
      }
    }
  };

  return (
    <VideoContext.Provider value={{ callUser }}>
      {children}
    </VideoContext.Provider>
  );

};

export default VideoProvider;

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};