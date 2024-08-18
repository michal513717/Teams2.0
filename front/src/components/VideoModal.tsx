import { VideoContext, VideoContextType } from "./../context/VideoCallContext";
import { useCallback, useContext, useEffect, useState } from "react";
import { Box, CircularProgress, IconButton, Modal } from "@mui/material"
import { useVideoStore } from "./../stores/videoStorage"
import { useChatStorage } from "@/stores/chatStorage";
import CloseIcon from '@mui/icons-material/Close';

export const VideoModal = () => {
  const [countdown, setCountdown] = useState(5);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const { selectedUserChat } = useChatStorage();
  const {
    isVideoModalOpen,
    isRequestCallModalOpen,
    setIsCallAccepted,
    setIsRequestCallModalOpen,
    setIsVideoModalOpen,
    isCallAccepted
  } = useVideoStore();

  const {
    callUser,
    peerConnection,
    callAnswerMade,
    resetVideoContext,
    isSecondCall
  } = useContext(VideoContext) as VideoContextType;

  useEffect(() => {

    if (isVideoModalOpen === false) return;

    setLocalVideo();

  }, [isVideoModalOpen, isRequestCallModalOpen]);

  const setLocalVideo = useCallback(async () => {

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    addToPeerConnection(stream);

    setLocalStream(stream);

    if (isRequestCallModalOpen === true) {

      if (isSecondCall === false) {
        callAnswerMade(true);
      }

      return;
    }

    callUser(selectedUserChat!);
  }, [peerConnection, selectedUserChat, isRequestCallModalOpen, callAnswerMade, isSecondCall]);

  const addToPeerConnection = useCallback((stream: MediaStream) => {
    stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream);
    });
  }, [peerConnection]);

  useEffect(() => {
    peerConnection.ontrack = ({ streams: [stream] }) => {
      setRemoteStream(stream);
    };
  }, [peerConnection]);

  useEffect(() => {
    if (isCallAccepted === null || isCallAccepted === true) return;

    const countdownTimer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 0) {
          return prevCountdown - 1;
        } else {
          clearInterval(countdownTimer);
          return 0;
        }
      });
    }, 1000);

    return () => {
      clearInterval(countdownTimer);
    }
  }, [isCallAccepted, localStream]);

  useEffect(() => {
    if (!(countdown === 0 && isCallAccepted === false)) {
      return;
    }

    resetVideoContext();
    resetVideo();

  }, [countdown, isCallAccepted, localStream]);

  const resetVideo = useCallback(() => {

    console.info("Reset Video modal");

    if (localStream !== null) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    if(remoteStream !== null){
      remoteStream.getTracks().forEach((track) =>{
        track.stop();
      })
    }

    setLocalStream(null);
    setRemoteStream(null);
    setIsCallAccepted(null);
    setIsVideoModalOpen(false);
    setIsRequestCallModalOpen(false);
  }, [localStream, remoteStream]);

  const resetAll = useCallback(() => {
    resetVideo();
    resetVideoContext();
  }, []);

  return (
    <Modal
      open={isVideoModalOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="modal-style">
        <Box position={"absolute"} right={'20px'} top={"20px"} >
          <IconButton onClick={resetAll}>
            <CloseIcon/>
          </IconButton>
        </Box>
        {localStream && (
          <video autoPlay className="video-call" ref={video => {
            if (video) {
              video.srcObject = localStream
            }
          }} />
        )}

        {remoteStream !== null ? (
          <video autoPlay className="video-call" ref={video => {
            if (video) {
              video.srcObject = remoteStream
            }
          }} />
        ) : (
          <Box width={'100%'} height={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            {
              isCallAccepted === false ? (
                <>
                  <h2>
                    User rejected call
                  </h2>
                  <div>
                    {countdown}
                  </div>
                </>
              ) : (<></>)
            }
            {
              isCallAccepted === null ? (
                <CircularProgress color="inherit" />
              ) : (<></>)
            }
          </Box>
        )}
      </div>
    </Modal>
  )
}