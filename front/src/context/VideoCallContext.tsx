import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/authStorage";
import { GLOBAL_CONFIG } from "./../../../config.global";
import { useSocketStore } from "@/stores/socketStorage";
import { useVideoStore } from "@/stores/videoStorage";

export type VideoContextType = {
  peerConnection: RTCPeerConnection;
  offer: RTCSessionDescription | null;
  isSecondCall:boolean;
  resetVideoContext: () => void;
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
  const [callerUserName, setCallerUserName ] = useState<string>('');
  const [isSecondCall, setIsSecondCall] = useState<boolean>(false);
  const { setIsRequestCallModalOpen, setIsCallAccepted } = useVideoStore();
  const { userName } = useAuthStore();
  const { socket } = useSocketStore();

  useEffect(() => {
    if (socket === null) return;

    socket.on(GLOBAL_CONFIG.SOCKET_EVENTS.CALL_MADE, async (data) => {

      counter++;
      console.log(data)
      setCallerUserName(data.userName);
    
      setOffer(data.offer);

      if(counter === 2){

        setIsSecondCall(true);
        callAnswerMade(true, data.offer);
        return;
      }

      setIsRequestCallModalOpen(true);
    });

    socket.on(GLOBAL_CONFIG.SOCKET_EVENTS.ANSWER_MADE, async(data: Socket & any) => {
      console.log("answer made");
      console.log(data.isCallAccepted)
      setIsCallAccepted(data.isCallAccepted);

      if(data.isCallAccepted === false) return;

      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));

      if(isAlreadyCalling === false){
        await callUser(data.userName, true);
        setIsAlreadyCalling(true);
      }
    });
  }, [socket, isSecondCall, peerConnection, isAlreadyCalling]);

  const callUser = useCallback(async (userName: string, isSecondCall: boolean = false) => {

    console.log("call user - " + userName);

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

  const callAnswerMade = useCallback(async(isCallAccepted: boolean, secondOffer?: RTCSessionDescriptionInit) => {
    console.log("answer made")
    if(socket === null){
      console.warn("Socket is null, can't call user");
      return;
    };
    console.log(secondOffer)
    console.log(offer)
    if(typeof secondOffer !== "undefined"){
      console.log('ff')
      await peerConnection.setRemoteDescription(new RTCSessionDescription(secondOffer));
    } else if(offer !== null){
      console.log('fff')
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
    setIsRequestCallModalOpen(false);
  }, []);

  return (
    <VideoContext.Provider value={{ offer, callUser, callAnswerMade, peerConnection, isSecondCall, resetVideoContext }}>
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