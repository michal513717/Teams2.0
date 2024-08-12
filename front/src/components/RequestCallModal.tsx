import { useVideoStore } from "./../stores/videoStorage"
import { Modal, Box, Button } from "@mui/material"
import { useCallback, useContext } from "react";
import { VideoContext, VideoContextType } from "./../context/VideoCallContext";

export const RequestCallModal = () => {

  const { isRequestCallModalOpen, callerUserName, setIsVideoModalOpen, setIsRequestCallModalOpen } = useVideoStore();
  const { callAnswerMade, peerConnection } = useContext(VideoContext) as VideoContextType;

  const handleResponse = useCallback((status: boolean) => {
    if(status === false) return;

    setIsVideoModalOpen(true);

    setIsRequestCallModalOpen(false);

    callAnswerMade(callerUserName!);

  },[status, peerConnection, callerUserName]);

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