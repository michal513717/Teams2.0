import { useVideoStore } from "./../stores/videoStorage"
import { Modal, Box, Button } from "@mui/material"
import { useCallback, useContext } from "react";
import { VideoContextType } from "@/type/video.types";
import { VideoContext } from "./../context/VideoCallContext";
import { useSocketStore } from "@/stores/socketStorage";

export const RequestCallModal = () => {

  const { isRequestCallModalOpen, callerUserName, setIsVideoModalOpen, setIsRequestCallModalOpen } = useVideoStore();
  const { offer, callAnswerMade, resetVideoContext } = useContext(VideoContext) as VideoContextType;
  const { socket } = useSocketStore();

  const handleResponse = useCallback((status: boolean) => {

    if(status === false){
      callAnswerMade(false);
      setIsRequestCallModalOpen(false);
      resetVideoContext();
      return;
    }

    setIsVideoModalOpen(true);

  },[status, socket, offer]);

  return (
    <Modal
      open={isRequestCallModalOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="request-call-modal-style">
        <h1> { callerUserName } </h1>
        <Box>
          <Button onClick={() => handleResponse(true)}> Accept </Button>
          <Button onClick={() => handleResponse(false)}> Decline </Button>
        </Box>
      </div>
    </Modal>
  )
}