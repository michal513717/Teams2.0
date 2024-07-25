import React, { createContext, useState, useContext, useEffect, useRef, ReactNode } from "react";
import { globalSocket as socket } from "./ChatContext"; 

interface VideoContextType {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  startCall: (remoteUserID: string) => void;
  endCall: () => void;
}

export const VideoContext = createContext<VideoContextType | null>(null);

const VideoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const initializeLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        console.log("Local stream initialized");
      } catch (error) {
        console.error("Error accessing local media:", error);
      }
    };

    initializeLocalStream();

    if (socket) {
      socket.on("offer-made", async ({ offer, socket: fromSocketID }) => {
        console.log("Offer received from", fromSocketID);
        if (peerConnection.current) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(new RTCSessionDescription(answer));
          if (socket) {
            socket.emit("make-answer", { answer, to: fromSocketID });
            console.log("Answer sent to", fromSocketID);
          }
        }
      });

      socket.on("answer-made", async ({ answer }) => {
        console.log("Answer received");
        if (peerConnection.current) {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });

      socket.on("ice-candidate", ({ candidate }) => {
        console.log("ICE candidate received");
        if (peerConnection.current) {
          peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("offer-made");
        socket.off("answer-made");
        socket.off("ice-candidate");
      }
    };
  }, []);

  const startCall = async (remoteUserID: string) => {
    if (localStream && socket) {
      peerConnection.current = new RTCPeerConnection();

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate && socket) { 
          socket.emit("ice-candidate", { candidate: event.candidate, to: remoteUserID });
          console.log("ICE candidate sent to", remoteUserID);
        }
      };

      peerConnection.current.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        console.log("Remote stream added");
      };

      localStream.getTracks().forEach((track) => {
        peerConnection.current!.addTrack(track, localStream);
      });

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(new RTCSessionDescription(offer));
      if (socket) { 
        socket.emit("make-offer", { offer, to: remoteUserID });
        console.log("Offer sent to", remoteUserID);
      }
    }
  };

  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setRemoteStream(null);
  };

  return (
    <VideoContext.Provider value={{ localStream, remoteStream, startCall, endCall }}>
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