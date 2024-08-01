import SideProfilesMenu from "./SideProfilesMenu";
import { useParams } from "react-router-dom";
import { useLogin } from "@/hooks/useLogin";
import { Box, Button } from "@mui/material";
import ChatScreen from "./ChatScreen";
import React from "react";
import "./Screen.css";
import { SidePanelMenu } from "@/components/SidePanelMenu";
import { UserTopPanelActivity } from "@/components/UserTopPanelActivity";
import { VideoModal } from "@/components/VideoModal";

const MainScreen: React.FC = () => {
  const { logoutUser } = useLogin();
  const { user_chat } = useParams();

  const handleLogout = async () => {
    logoutUser();
  };

  return (
    <Box width={1} height={1}>
      <SidePanelMenu/>
      <UserTopPanelActivity/>
      <VideoModal/>
    </Box>
  );
};

export default MainScreen;