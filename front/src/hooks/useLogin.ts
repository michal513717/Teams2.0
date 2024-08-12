import { useAuthStore } from "@/stores/authStorage";
import { CONFIG } from "@/utils/config";
import axios from "axios";
import {
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/stores/localStorage";


export const useLogin = () => {
  const { setIsAuthenticated, setUserName } = useAuthStore();
  
  const loginUser = async (
    userName: string,
    password: string
  ): Promise<number> => {
    try {
      const data = { userName, password };
      const response = await axios.post(
        CONFIG.SERVER_URL + CONFIG.END_POINTS.LOGIN_ROUTE,
        data
      );
      const { accessToken, refreshToken } = response.data.result;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUserName(userName);
      setIsAuthenticated(true);
      return response.status;
    } catch (error: any) {
      console.error("Login failed:", error);
      return error.response?.status || 500;
    }
  };

  const logoutUser = (): void => {
    removeAccessToken();
    removeRefreshToken();
    setIsAuthenticated(false);
    setUserName(null);
  };


  return {
    loginUser,
    logoutUser
  };
}