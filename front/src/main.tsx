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

const applicationRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainScreen />,
  },
]);

const authRouter = createBrowserRouter([
  {
    path: "/",
    element: <LoginScreen />,
  },
  {
    path: "/register",
    element: <RegisterScreen />,
  },
]);

const App = () => {
  const { user } = useUser();

  return (
    <RouterProvider router={user ? applicationRouter : authRouter} />
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