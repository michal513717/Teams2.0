import MainScreen from "./../screens/MainScreen";
import LoginScreen from "./../screens/LoginScreen";
import RegisterScreen from "./../screens/RegisterScreen";
import { Link, createBrowserRouter } from "react-router-dom";

export const authRouter = createBrowserRouter([
  {
    path: "/",
    element: <LoginScreen />,
  },
  {
    path: "/register",
    element: <RegisterScreen />,
  }
]);

export const mainRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainScreen />,
    ErrorBoundary: () => (
      <div>
        <Link to="/">Go back to home page.</Link>
      </div>
    )
  }
]);
