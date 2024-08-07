import { useChatStorage } from "@/stores/chatStorage"
import { Box, Button, CircularProgress, ListItem } from "@mui/material"
import UserCard from "./UserCard";
import { useContext, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { useLogin } from "@/hooks/useLogin";
import { ChatContext, ChatContextType } from "@/context/ChatContext";


export const SidePanelMenu = () => {
  const { chatUsers } = useContext(ChatContext) as ChatContextType;
  const { logoutUser } = useLogin();
  const { fetchUsers, isLoading } = useChat();

  useEffect(() => {
    if (chatUsers.length === 0) {
      fetchUsers();
    }
  }, [chatUsers]);

  const handleLogout = async () => {
    logoutUser();
  };

  return (
    <div className={'left-panel'}>
      {
        isLoading ? (
          <CircularProgress color="inherit" />
        ) : (
          chatUsers.map((user, index) => (
            <UserCard
              key={`${user.userName}${index}`}
              userName={user.userName}
              isActive={user.connected}
            />
          ))
        )
      }
      <Box position={"absolute"} left={'20px'} bottom={'20px'} bgcolor={'white'}>
        <Button onClick={handleLogout}>Log out</Button>
      </Box>
    </div>
  )
}