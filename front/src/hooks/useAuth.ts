import { useAuthStore } from "@/stores/authStorage";
import { getAccessToken } from "@/stores/localStorage";
import { CONFIG } from "@/utils/config";
import axios from "axios";


export const useAuth = () => {
  const { isAuthenticated, setIsAuthenticated, setUserName } = useAuthStore();
  
  const checkAuthStatus = async () => {
    const accessToken = getAccessToken();
    
    const response = await axios.get(
      CONFIG.SERVER_URL + CONFIG.END_POINTS.CHECK_TOKEN,
      {
        headers: { Authorization: `Bearer: ${accessToken}` },
      }
    )

    setIsAuthenticated(response.status === 200 ? true : false);
    setUserName(response.status === 200 ? response.data.result.userName : null);
  
    return response.status === 200;
  };

  return {
    checkAuthStatus,
    isAuthenticated
  };
}