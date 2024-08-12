import { useVideoStore } from "./../stores/videoStorage"
import { Modal } from "@mui/material"
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { VideoContext, VideoContextType } from "./../context/VideoCallContext";
import { useChatStorage } from "@/stores/chatStorage";

export const VideoModal = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const { isModalOpen } = useVideoStore();
  const { selectedUserChat } = useChatStorage();
  const { callUser } = useContext(VideoContext) as VideoContextType;

  useEffect(() => {
    
    if(isModalOpen === false) return;

    setLocalVideo();

  }, [isModalOpen]);

  const setLocalVideo = useCallback(async() => {
    
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    setLocalStream(stream);

    callUser(selectedUserChat as string);
  },[selectedUserChat]);

  return (
    <Modal
      open={isModalOpen}
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