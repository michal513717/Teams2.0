import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/authStorage";
import { GLOBAL_CONFIG } from "./../../../config.global";
import { useSocketStore } from "@/stores/socketStorage";
import { useVideoStore } from "@/stores/videoStorage";

export type VideoContextType = {
  peerConnection: RTCPeerConnection;
  offer: RTCSessionDescription | null;
  isSecondCall: boolean;
  resetVideoContext: () => void;
  endCall: (userName: string) => void;
  callUser: (userName: string) => void;
  callAnswerMade: (isCallAccepted: boolean) => void;
};

const { RTCPeerConnection } = window;

const peerConnection = new RTCPeerConnection();

//TODO celan up this variable
let counter = 0;

export const VideoContext = createContext<VideoContextType | null>(null);

const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAlreadyCalling, setIsAlreadyCalling] = useState<boolean>(false);
  const [offer, setOffer] = useState<RTCSessionDescription | null>(null);
  const [isSecondCall, setIsSecondCall] = useState<boolean>(false);
  const { setIsRequestCallModalOpen, setIsCallAccepted, setIsVideoModalOpen, callerUserName, setCallerUserName} = useVideoStore();
  const { userName } = useAuthStore();
  const { socket } = useSocketStore();

  useEffect(() => {
    if (socket === null) return;

    //TODO fix types
    socket.on(GLOBAL_CONFIG.SOCKET_EVENTS.CALL_MADE, async (data) => {

      //TODO replace this variable
      counter++;
  
      setCallerUserName(data.userName);

      setOffer(data.offer);

      if (counter === 2) {

        setIsSecondCall(true);
        callAnswerMade(true, data.offer);
        return;
      }

      setIsRequestCallModalOpen(true);
    });

    //TODO fix types
    socket.on(GLOBAL_CONFIG.SOCKET_EVENTS.ANSWER_MADE, async (data: Socket & any) => {

      setIsCallAccepted(data.isCallAccepted);

      if (data.isCallAccepted === false) return;

      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));

      if (isAlreadyCalling === false) {
        await callUser(data.userName);
        setIsAlreadyCalling(true);
      }
    });
  
    //TODO fix types
    socket.on(GLOBAL_CONFIG.SOCKET_EVENTS.USER_END_CALL, async (data: Socket & any) => {
      resetVideoContext();
    });

  }, [socket, isSecondCall, peerConnection, isAlreadyCalling]);

  const callUser = useCallback(async (userName: string) => {

    if (socket === null) {
      console.warn("Socket is null, can't call user");
      return;
    }

    const offer = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

    socket.emit(GLOBAL_CONFIG.SOCKET_EVENTS.CALL_USER, {
      offer,
      to: userName,
    });
  }, [socket, userName, peerConnection]);

  const callAnswerMade = useCallback(async (isCallAccepted: boolean, secondOffer?: RTCSessionDescriptionInit) => {

    if (socket === null) {
      console.warn("Socket is null, can't call user");
      return;
    };

    // TODO fix this else if or replace
    if (typeof secondOffer !== "undefined") {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(secondOffer));
    } else if (offer !== null) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    }

    const answer = await peerConnection.createAnswer();

    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

    socket.emit(GLOBAL_CONFIG.SOCKET_EVENTS.MAKE_ANSWER, {
      answer,
      to: callerUserName,
      isCallAccepted
    })
  }, [offer, socket, peerConnection, callerUserName]);


  const resetVideoContext = useCallback(() => {

    counter = 0;

    setOffer(null);
    setIsSecondCall(false);
    setCallerUserName('');
    setIsCallAccepted(null);
    setIsAlreadyCalling(false);
    setIsVideoModalOpen(false);
    setIsRequestCallModalOpen(false);
  }, []);

  const endCall = useCallback((userName: string) => {
    if (socket === null) {
      console.warn("Socket is undefined");
      return;
    }

    socket.emit(GLOBAL_CONFIG.SOCKET_EVENTS.END_CALL, {
      to: userName
    });
  }, [socket]);

  return (
    <VideoContext.Provider value={{ offer, callUser, callAnswerMade, peerConnection, isSecondCall, resetVideoContext, endCall }}>
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