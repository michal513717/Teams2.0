import Container from "@mui/material/Container";
import "./Screen.css";
import { useContext, useEffect } from "react";
// import { ChatContext, ChatContextType, ChatUser } from "@/context/ChatContext";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStorage";
import { useChatStorage } from "@/stores/chatStorage";
import { useChat } from "@/hooks/useChat";
import { ChatUser, UserStatus } from "@/type/common.types";

type Props = { chat_user: string | undefined };

const SideProfilesMenu: React.FC<Props> = ({ chat_user }) => {
  const navigate = useNavigate();
  const { userName } = useAuthStore();
  const { fetchUsers } = useChat();
  const { chatUsers } = useChatStorage();

  useEffect(() => {
    if(chatUsers.length === 0){
      fetchUsers();
    }
  }, [chatUsers]);

  return (
    <Container className="players">
      <>
        {
        chatUsers.map((user: UserStatus) => (
          <div
            key={user.userName}
            className={user.userName === chat_user ? "player clicked" : "player"}
            onClick={
              user.userName === chat_user ?
              () => {}
              : () => {
                navigate(`/chat/${user.userName}`)
              }
            }
          >
            <span
              className={
                user.connected === true ? "status online" : "status offline"
              }
            ></span>{" "}
            {user.userName} {user.userName === userName ? "(you)" : ""}
          </div>
        ))}
      </>
    </Container>
  );
};

export default SideProfilesMenu;
