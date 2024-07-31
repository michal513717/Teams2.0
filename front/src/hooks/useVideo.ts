import { useChatStorage } from "@/stores/chatStorage";
import { useSocket } from "./useSocket";
import { CONFIG } from "@/utils/config";

const { RTCPeerConnection, RTCSessionDescription } = window;

const peerConection = new RTCPeerConnection();

export const useVideo = () => {
  const { socket } = useChatStorage();

  // or user id
  const callUser = async(socketId: string) => {
    if(socket === null) return;

    const offer = await peerConection.createOffer();
    await peerConection.setLocalDescription(new RTCSessionDescription(offer));

    socket.emit(CONFIG.SOCKET_EVENTS.CALL_USER, {
      offer, 
      to: socketId
    })
  }

  return {
    callUser
  }
}