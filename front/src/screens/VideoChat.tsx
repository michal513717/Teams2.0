import React, { useEffect, useRef } from "react";
import { useVideo } from "@/context/VideoContext";

interface VideoChatProps {
  remoteUserID: string;
  onEndCall: () => void;
}

const VideoChat: React.FC<VideoChatProps> = ({ remoteUserID, onEndCall }) => {
  const { localStream, remoteStream, startCall, endCall } = useVideo();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callInitiated = useRef(false);

  useEffect(() => {
    if (!callInitiated.current) {
      console.log("Starting call with", remoteUserID);
      startCall(remoteUserID);
      callInitiated.current = true;
    }

    return () => {
      if (callInitiated.current) {
        console.log("Ending call");
        endCall();
        callInitiated.current = false;
      }
    };
  }, [remoteUserID, startCall, endCall]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      console.log("Local stream set");
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      console.log("Remote stream set");
    }
  }, [remoteStream]);

  return (
    <div className="video-chat-container">
      <div className="video-container">
        <video ref={localVideoRef} autoPlay muted className="video" />
        <video ref={remoteVideoRef} autoPlay className="video" />
      </div>
    </div>
  );
};

export default VideoChat;