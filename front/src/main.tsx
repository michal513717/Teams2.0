import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainScreen from './screens/MainScreen';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import theme from './theme';
import AuthGuard from './guards/AuthGuard';

const applicationRouter = createBrowserRouter([
  {
    path: "/chat/:user_chat",
    element: <AuthGuard component={MainScreen}/>,
  },
  {
    path: "/",
    element: <AuthGuard component={MainScreen}/>,
  },
  {
    path: "/login",
    element: <LoginScreen/>
  },
  {
    path: "/register",
    element: <RegisterScreen />,
  },
]);


const App = () => {
  return (
    <RouterProvider router={applicationRouter} />
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <App />
      </UserProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

postMessage({ payload: 'removeLoading' }, '*');