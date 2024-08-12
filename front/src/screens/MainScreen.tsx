import { Box } from "@mui/material";
import ChatScreen from "./ChatScreen";
import React, { useEffect } from "react";
import "./../components/css/Screen.css";
import { SidePanelMenu } from "@/components/SidePanelMenu";
import { VideoModal } from "@/components/VideoModal";
import ChatProvider from "@/context/ChatContext";
import { useChatStorage } from "@/stores/chatStorage";
import { useChat } from "@/hooks/useChat";
import VideoProvider from "@/context/VideoCallContext";

const MainScreen: React.FC = () => {

  const { fetchUsers } = useChat();
  const { chatUsers, selectedUserChat, setSelectedUserChat } = useChatStorage();

  useEffect(() => {

    if (chatUsers.length === 0) {
      setSelectedUserChat(null);
      fetchUsers();
      return;
    } else if (selectedUserChat === null) {
      setSelectedUserChat(chatUsers[0].userName);
    }

  }, [chatUsers, selectedUserChat]);

  return (
    <ChatProvider>
      <Box width={1} height={1}>
        <SidePanelMenu />
        <VideoProvider>
          <ChatScreen chat_user={selectedUserChat ?? ""} />
          <VideoModal />
        </VideoProvider>
      </Box>
    </ChatProvider>
  );
};

export default MainScreen;