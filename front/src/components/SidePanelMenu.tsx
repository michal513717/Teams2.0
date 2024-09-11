import { Box, Button, CircularProgress } from "@mui/material"
import UserCard from "./userCard";
import { useContext, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { useLogin } from "@/hooks/useLogin";
import { ChatContext, ChatContextType } from "@/context/ChatContext";


export const SidePanelMenu = () => {
  const { chatUsers, messages, getUnreadMessages, unreadMessages } = useContext(ChatContext) as ChatContextType;
  const { logoutUser } = useLogin();
  const { isLoading } = useChat();

  const getLastMessage = (userName: string): string => {
    const userMessages = messages.filter(
      (msg) => msg.from === userName || msg.to === userName
    );
    if (userMessages.length > 0) {
      return userMessages[userMessages.length - 1].content || "No messages";
    }
    return "No messages";
  };

  useEffect(() => {
    getUnreadMessages();
  }, []);

  useEffect(() => {
    console.log(unreadMessages)
  }, [unreadMessages]);

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
              userCardName={user.userName}
              isActive={user.connected}
              lastMessage={getLastMessage(user.userName)}
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