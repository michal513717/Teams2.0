import { useVideoStore } from "./../stores/videoStorage"
import { Modal } from "@mui/material"
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { VideoContext, VideoContextType } from "./../context/VideoCallContext";

export const VideoModal = () => {
  const localVideoElement = useRef<HTMLVideoElement>(null);
  const callerVideoElement = useRef<HTMLVideoElement>(null);

  const [remoteVideoRefs, setRemoteVideoRefs] = useState<HTMLVideoElement[]>([]);

  const { peerConnection } = useContext(VideoContext) as VideoContextType;

  const { isModalOpen } = useVideoStore();

  const localVideoRef = useRef<HTMLVideoElement>(null);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Uzyskaj lokalny strumień wideo
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        console.log("stream on")
        if (localVideoRef.current) {
          console.log("OK")
          localVideoRef.current.srcObject = stream;
          //@ts-ignore
          localVideoRef.autoplay = true;
          //@ts-ignore
          localVideoRef.playsInline = true;
        }

        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream);
        });
      })
      .catch((err) => {
        console.error("Błąd dostępu do kamery:", err);
      });

    // Obsługa strumienia wideo z połączenia zdalnego

    peerConnection.ontrack = (event) => {
      console.log("remote")
      setRemoteVideoRefs((prevRefs) => {
        const newVideoRef = document.createElement("video");
        newVideoRef.srcObject = event.streams[0];
        newVideoRef.className = "video-call";
        newVideoRef.autoplay = true;
        newVideoRef.playsInline = true;
        return [newVideoRef];
      });
    };
    // peerConnection.ontrack = ({ streams: [stream] }) => {
    //   console.log("stream remote")
    //   console.log(event)
    //   if (!remoteVideoRef.current?.srcObject) {
    //     console.log(stream)
    //     console.log(remoteVideoRef)
    //     console.log(document.getElementById('remote-video'))
    //     //@ts-ignore
    //     document.getElementById('remote-video').srcObject = stream;
    //   } else if (!secondRemoteVideoRef.current?.srcObject) {
    //     console.log(secondRemoteVideoRef)
    //     secondRemoteVideoRef.current!.srcObject = stream;
    //   }
    // };

  }, [peerConnection, remoteVideoRef]);

  console.log(remoteVideoRefs)

  return (
    <Modal
      open={isModalOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="modal-style">

        <video autoPlay={true} className="video-call" ref={localVideoRef} />
        <>
          {
            remoteVideoRefs.map((videoRef, index) => {
              return (

                <div key={index}>
                  <h3>Remote Video {index + 1}</h3>
                  <div ref={(node) => node?.appendChild(videoRef)} />
                </div>
              )
            })
          }
        </>


      </div>
    </Modal>
  )
}