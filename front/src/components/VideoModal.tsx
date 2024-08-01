import { useVideoStore } from "@/stores/videoStorage"
import { peerConnection } from "@/utils/globals";
import { Modal, Box } from "@mui/material"
import { useEffect, useRef, useState } from "react";



export const VideoModal = () => {
  const [localVideo, setLocalVideo] = useState();
  const localVideoElement = useRef<HTMLVideoElement>(null);
  const callerVideoElement = useRef<HTMLVideoElement>(null);

  const { isModalOpen } = useVideoStore();

  useEffect(() => {
    if(isModalOpen === false) return;
    
    window.navigator.mediaDevices.getUserMedia({
      video: true, audio: true
    }).then((stream) => {
      if(!localVideoElement.current) return;
      localVideoElement.current.srcObject = stream;
      stream.getTracks().forEach( track => peerConnection.addTrack(track, stream));
    });

    peerConnection.ontrack = function({ streams: [stream] }) {
      if(!callerVideoElement.current) return;
      callerVideoElement.current.srcObject = stream;
    }

  }, [isModalOpen]);

  return (
    <Modal
      open={isModalOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="modal-style">
        <video ref={localVideoElement}/>
        <video ref={callerVideoElement}/>
      </div>
    </Modal>
  )
}