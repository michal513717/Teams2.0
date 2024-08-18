import { CONFIG } from "@/utils/config";
import axios from "axios";
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
      return await loginUser(userName, password);
    } catch (error: any) {
      console.error("Registration failed:", error);
      return error.response?.status || 500;
    }
  };

  return {
    registerUser
  };
}