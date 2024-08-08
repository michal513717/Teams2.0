import { useVideoStore } from "@/stores/videoStorage"
import { Modal } from "@mui/material"
import { useCallback, useEffect, useRef, useState } from "react";

export const VideoModal = () => {
  const localVideoElement = useRef<HTMLVideoElement>(null);
  const callerVideoElement = useRef<HTMLVideoElement>(null);

  const { isModalOpen } = useVideoStore();

  useEffect(() => {
    if (isModalOpen === false) return;

    setupLocalVideo();

  }, [isModalOpen]);

  const setupLocalVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    if (!localVideoElement.current) return;

    localVideoElement.current.srcObject = stream;
  }

  return (
    <Modal
      open={isModalOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="modal-style">
        {/* <button onClick={call}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem illo placeat, accusantium commodi porro natus eius ut similique reprehenderit non.</button> */}
        {/* <button onClick={active}>active</button> */}
        <video autoPlay={true} className="video-call" ref={localVideoElement} />
        <video autoPlay={true} className="video-call" id="local-video" ref={callerVideoElement} />
      </div>
    </Modal>
  )
}