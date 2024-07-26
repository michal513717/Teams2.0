import { useChatStorage } from "@/stores/chatStorage";
import { getAccessToken } from "@/stores/localStorage";
import { CONFIG } from "@/utils/config";
import axios from "axios";
import { useAuth } from "./useAuth";

export const useChat = () => {
  const { setChatUsers } = useChatStorage();
  const { checkAuthStatus } = useAuth();

  const fetchUsers = async () => {
    try {
      const accessToken = getAccessToken();
      const response = await axios.get(CONFIG.SERVER_URL + CONFIG.END_POINTS.ALL_USERS, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const users = response.data.result.map((name: string) => ({
        name,
        status: "offline", // Default status
      }));
      setChatUsers(users);
    } catch (error) {
      await checkAuthStatus();
      console.error("Error fetching users:", error);
    }
  };

  return {
    fetchUsers
  }
}