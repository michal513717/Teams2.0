import React from "react";
import "./Screen.css";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import SideProfilesMenu from "./SideProfilesMenu";
// import ChatProvider from "@/context/ChatContext";
import ChatScreen from "./ChatScreen";
import { useLogin } from "@/hooks/useLogin";

const MainScreen: React.FC = () => {
  const { logoutUser } = useLogin();
  const { user_chat } = useParams();

  const handleLogout = async () => {
    logoutUser();
  };

  return (
      <div className="main-screen">
        <div className="sidebar">
          <SideProfilesMenu chat_user={user_chat} />
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <ChatScreen chat_user={user_chat} />
      </div>
  );
};

export default MainScreen;