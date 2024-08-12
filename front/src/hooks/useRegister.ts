import { useAuthStore } from "@/stores/authStorage";
import { CONFIG } from "@/utils/config";
import axios from "axios";
import {
  setAccessToken,
  setRefreshToken,
} from "@/stores/localStorage";
import { useLogin } from "./useLogin";


export const useRegister = () => {
  const { loginUser } = useLogin();
  
  const registerUser = async (
    userName: string,
    password: string,
    confirmPassword: string
  ): Promise<number> => {
    try {
      const data = { userName, password, confirmPassword };
      const response = await axios.post(
        CONFIG.SERVER_URL + CONFIG.END_POINTS.REGISTER_ROUTE,
        data
      );
      const loginStatus = await loginUser(userName, password);
      return loginStatus;
    } catch (error: any) {
      console.error("Registration failed:", error);
      return error.response?.status || 500;
    }
  };

  return {
    registerUser
  };
}