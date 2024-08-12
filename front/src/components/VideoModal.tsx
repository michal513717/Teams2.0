import { useVideoStore } from "./../stores/videoStorage"
import { Modal } from "@mui/material"
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { VideoContext, VideoContextType } from "./../context/VideoCallContext";
import { useChatStorage } from "@/stores/chatStorage";

export const VideoModal = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const { isVideoModalOpen, isRequestCallModalOpen } = useVideoStore();
  const { selectedUserChat } = useChatStorage();
  const { callUser, peerConnection } = useContext(VideoContext) as VideoContextType;

  useEffect(() => {
    
    if(isVideoModalOpen === false) return;

    setLocalVideo();

  }, [isVideoModalOpen, isRequestCallModalOpen]);

  const setLocalVideo = useCallback(async() => {
    
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    addToPeerConnection(stream);

    setLocalStream(stream);

    if(isRequestCallModalOpen === true) return;
    
    callUser(selectedUserChat as string);
    
  },[selectedUserChat, isRequestCallModalOpen]);

  const addToPeerConnection = useCallback((stream: MediaStream) =>{
    stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream);
    });
  }, [peerConnection]);

  return (
    <Modal
      open={isVideoModalOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="modal-style">
        {localStream && (
          <video autoPlay className="video-call" ref={video => {
            if(video){
              video.srcObject = localStream
            }
          }} />
        )}

      </div>
    </Modal>
  )
}