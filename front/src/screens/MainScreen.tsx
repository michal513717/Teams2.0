import React from "react";
import "./Screen.css";
import { useUser } from "@/context/UserContext";
import { Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import SideProfilesMenu from "./SideProfilesMenu";
import ChatProvider from "@/context/ChatContext";
import ChatScreen from "./ChatScreen";

const MainScreen: React.FC = () => {
  const { logoutUser } = useUser();
  const navigate = useNavigate();
  const { user_chat } = useParams();

  const handleLogout = async () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <ChatProvider>
      <div className="main-screen">
        <div className="sidebar">
          <SideProfilesMenu chat_user={user_chat} />
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <ChatScreen chat_user={user_chat} />
      </div>
    </ChatProvider>
  );
};

export default MainScreen;