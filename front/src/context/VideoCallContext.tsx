import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { getAccessToken } from "@/stores/localStorage";
import { CONFIG } from "@/utils/config";
import { useAuthStore } from "@/stores/authStorage";
import { GLOBAL_CONFIG } from "./../../../config.global";
import { useSocketStore } from "@/stores/socketStorage";
import { useChatStorage } from "@/stores/chatStorage";
import { useVideoStore } from "@/stores/videoStorage";

export type VideoContextType = {
  peerConnection: RTCPeerConnection;
  callUser: (userName: string) => void;
  callAnswerMade: (to: string) => void;
};

const { RTCPeerConnection } = window;

const peerConnection = new RTCPeerConnection();

export const VideoContext = createContext<VideoContextType | null>(null);

const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAlreadyCalling, setIsAlreadyCalling] = useState<boolean>(false);
  const [offer, setOffer] = useState<any>();
  const { userName } = useAuthStore();
  const { socket } = useSocketStore();
  const { setIsRequestCallModalOpen } = useVideoStore();
  const { chatUsers } = useChatStorage();


  useEffect(() => {

    if (socket === null) return;

    socket.on(GLOBAL_CONFIG.SOCKET_EVENTS.CALL_MADE, async (data) => {
      console.log("call made")

      setIsRequestCallModalOpen(true);

      setOffer(data.offer);
    });

    socket.on(GLOBAL_CONFIG.SOCKET_EVENTS.ANSWER_MADE, async (data) => {
      console.log("answer made")

      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer))

      if (isAlreadyCalling === false) {
        await callUser(data.userName, true);
        setIsAlreadyCalling(true);
      }
    });

    socket.on("disconnect", () => {
      // TODO remove user
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, isAlreadyCalling]);

  const callUser = useCallback(async (userName: string, isSecondCall: boolean = false) => {
    console.log("call user - " + userName)

    let isUserExist = false;

    if (socket === null) {
      console.warn("Socket is null, can't call user");
      return;
    }

    for (const chatUser of chatUsers) {
      if (chatUser.userName === userName) {
        if (chatUser.connected === false) {
          console.warn("User is offline");
          return;
        };

        isUserExist = true;

        break;
      }
    }

    if (isUserExist === false && isSecondCall === false) {
      console.warn("User doesn't exist")
      return;
    }

    const offer = await peerConnection.createOffer(); 

    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

    socket.emit("call-user", {
      offer,
      to: userName,
    });
  }, [socket, userName, chatUsers]);

  const callAnswerMade = useCallback(async(to: string) => {
    if (socket === null) {
      console.warn("Socket is null, can't call user");
      return;
    }

    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

    socket.emit(GLOBAL_CONFIG.SOCKET_EVENTS.MAKE_ANSWER, {
      answer,
      to
    })

  }, [socket, offer])

  //TODO implement
  peerConnection.ontrack = function ({ streams: [stream] }) {
    console.log("rmoet")
    const remoteVideo = document.getElementById("remote");
    if (remoteVideo) {
      //@ts-ignore
      remoteVideo.srcObject = stream;
    }
  };

  return (
    <VideoContext.Provider value={{ callUser, callAnswerMade, peerConnection }}>
      {children}
    </VideoContext.Provider>
  );

};

export default VideoProvider;

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  return context;
};