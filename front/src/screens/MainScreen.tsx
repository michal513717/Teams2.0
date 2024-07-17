import React, { useEffect, useState } from "react";
import "./Screen.css";
import { useUser } from "../context/UserContext";
import { Button, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import SideProfilesMenu from "./SideProfilesMenu";
import ChatProvider from "@/context/ChatContext";
import ChatScreen from "./ChatScreen";

const MainScreen: React.FC = () => {
  const { user, setUser, logoutUser } = useUser();
  const [messages, setMessages] = useState<string[]>(["Hello!"]);
  const [input, setInput] = useState<string>("");
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
        <ChatScreen chat_user={user_chat}></ChatScreen>
      </div>
    </ChatProvider>
  );
};

export default MainScreen;
