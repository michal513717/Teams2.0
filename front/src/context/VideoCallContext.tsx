import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useAuthStore } from "@/stores/authStorage";
import { GLOBAL_CONFIG } from "./../../../config.global";
import { useSocketStore } from "@/stores/socketStorage";
import { useVideoStore } from "@/stores/videoStorage";

export type VideoContextType = {
  peerConnection: RTCPeerConnection;
  offer: any;
  isSecondCall:boolean;
  callUser: (userName: string) => void;
  callAnswerMade: () => void;
};

const { RTCPeerConnection } = window;
const peerConnection = new RTCPeerConnection();
//TODO celan up this variable
let counter = 0;
export const VideoContext = createContext<VideoContextType | null>(null);

const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAlreadyCalling, setIsAlreadyCalling] = useState<boolean>(false);
  const [offer, setOffer] = useState<any>();
  const [callerUserName, setCallerUserName ] = useState<string>('');
  const [isSecondCall, setIsSecondCall] = useState<boolean>(false);
  const { userName } = useAuthStore();
  const { socket } = useSocketStore();
  const { setIsRequestCallModalOpen } = useVideoStore();

  useEffect(() => {
    if (socket === null) return;

    socket.on(GLOBAL_CONFIG.SOCKET_EVENTS.CALL_MADE, async (data) => {

      counter++;

      setCallerUserName(data.userName);
    
      setOffer(data.offer);

      if(counter === 2){

        setIsSecondCall(true);
        await callAnswerMade(data.offer);
        return;
      }

      setIsRequestCallModalOpen(true);
    });

    socket.on(GLOBAL_CONFIG.SOCKET_EVENTS.ANSWER_MADE, async(data) => {
      console.log("answer made");

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

    socket.emit("call-user", {
      offer,
      to: userName,
    });
  }, [socket, userName, peerConnection]);

  const callAnswerMade = useCallback(async(secondOffer?: RTCSessionDescriptionInit) => {

    if(socket === null){
      console.warn("Socket is null, can't call user");
      return;
    };
    
    if(typeof secondOffer !== "undefined"){
      await peerConnection.setRemoteDescription(new RTCSessionDescription(secondOffer));
    }else {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    }

    const answer = await peerConnection.createAnswer();

    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

    socket.emit(GLOBAL_CONFIG.SOCKET_EVENTS.MAKE_ANSWER, {
      answer,
      to: callerUserName
    })
  }, [offer, socket, peerConnection, callerUserName]);

  return (
    <VideoContext.Provider value={{ offer, callUser, callAnswerMade, peerConnection, isSecondCall }}>
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