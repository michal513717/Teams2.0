import Container from "@mui/material/Container";
import "./Screen.css";
import { useContext, useEffect } from "react";
import { ChatContext, ChatContextType, ChatUser } from "@/context/ChatContext";
import { useNavigate } from "react-router-dom";
import { getUserName } from "@/stores/localStorage";

type Props = { chat_user: string | undefined };

const SideProfilesMenu: React.FC<Props> = ({ chat_user }) => {
  const { chatUsers } = useContext(ChatContext) as ChatContextType;
  const navigate = useNavigate();
  const userName = getUserName();

  useEffect(() => {
    if (!chat_user && chatUsers.length > 0) {
      navigate(`/chat/${chatUsers[0].name}`);
    }
  }, [chat_user, chatUsers, navigate]);

  return (
    <Container className="players">
      <>
        {chatUsers.map((user: ChatUser) => (
          <div
            key={user.name}
            className={user.name == chat_user ? "player clicked" : "player"}
            onClick={
              user.name == chat_user
                ? () => {}
                : () => {
                    navigate(`/chat/${user.name}`);
                  }
            }
          >
            <span
              className={
                user.status == "online" ? "status online" : "status offline"
              }
            ></span>{" "}
            {user.name} {user.name === userName ? "(you)" : ""}
          </div>
        ))}
      </>
    </Container>
  );
};

export default SideProfilesMenu;
