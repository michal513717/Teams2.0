import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { getAccessToken } from "@/stores/localStorage";
import { CONFIG } from "@/utils/config";
import { useAuthStore } from "@/stores/authStorage";
import { GLOBAL_CONFIG } from "./../../../config.global";
import { useSocketStore } from "@/stores/socketStorage";
import { useChatStorage } from "@/stores/chatStorage";
import { useVideoStore } from "@/stores/videoStorage";

export type VideoContextType = {
  callUser: (userName: string) => void;
  peerConnection: RTCPeerConnection;
}

const { RTCPeerConnection } = window;

const peerConnection = new RTCPeerConnection();

export const VideoContext = createContext<VideoContextType | null>(null);

const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAlreadyCalling, setIsAlreadyCalling] = useState<boolean>(false);

  const { userName } = useAuthStore();
  const { socket } = useSocketStore();
  const { chatUsers } = useChatStorage();


  useEffect(() => {

    if (socket === null) return;

    socket.on(GLOBAL_CONFIG.SOCKET_EVENTS.CALL_MADE, async (data) => {
      console.log("call made")

      //TODO implement call answer
      // const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // let a = document.getElementById('local')
      // //@ts-ignore
      // a.srcObject = stream;
      // stream.getTracks().forEach(track => {
      //   peerConnection.addTrack(track, stream);
      // });

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

      callAnswerMade(answer, data.userName);
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

  const callAnswerMade = useCallback((answer: RTCSessionDescriptionInit, to: string) => {
    if (socket === null) {
      console.warn("Socket is null, can't call user");
      return;
    }

    socket.emit(GLOBAL_CONFIG.SOCKET_EVENTS.MAKE_ANSWER, {
      answer,
      to
    })

  }, [socket])


  peerConnection.ontrack = function ({ streams: [stream] }) {
    console.log("rmoet")
    const remoteVideo = document.getElementById("remote");
    if (remoteVideo) {
      //@ts-ignore
      remoteVideo.srcObject = stream;
    }
  };

  return (
    <VideoContext.Provider value={{ callUser, peerConnection }}>
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