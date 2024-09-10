import { Box, Button, CircularProgress } from "@mui/material"
import UserCard from "./userCard";
import { useContext } from "react";
import { useChat } from "@/hooks/useChat";
import { useLogin } from "@/hooks/useLogin";
import { ChatContext, ChatContextType } from "@/context/ChatContext";


export const SidePanelMenu = () => {
  const { chatUsers } = useContext(ChatContext) as ChatContextType;
  const { logoutUser } = useLogin();
  const { isLoading } = useChat();

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