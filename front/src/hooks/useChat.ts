import { useChatStorage } from "@/stores/chatStorage";
import { getAccessToken } from "@/stores/localStorage";
import { CONFIG } from "@/utils/config";
import axios from "axios";
import { useAuth } from "./useAuth";
import { useState } from "react";
import { UserStatus } from "@/type/common.types";

export const useChat = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setChatUsers } = useChatStorage();
  const { checkAuthStatus } = useAuth();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const accessToken = getAccessToken();
      const response = await axios.get(CONFIG.SERVER_URL + CONFIG.END_POINTS.ALL_USERS, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const users = response.data.result.map((user: UserStatus) => ({
        userName: user.userName,
        status: user.connected,
      }));
      setChatUsers(users);
    } catch (error) {
      await checkAuthStatus();
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchUsers,
    isLoading
  }
}