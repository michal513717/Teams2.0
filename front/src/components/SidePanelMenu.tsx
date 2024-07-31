import { useChatStorage } from "@/stores/chatStorage"
import { Box, CircularProgress, ListItem } from "@mui/material"
import UserCard from "./userCard";
import { useEffect } from "react";
import { useChat } from "@/hooks/useChat";


export const SidePanelMenu = () => {
  const { chatUsers } = useChatStorage();
  const { fetchUsers, isLoading } = useChat();

  useEffect(() => {
    if (chatUsers.length === 0) {
      fetchUsers();
    }
  }, [chatUsers]);

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
    </div>
  )
}