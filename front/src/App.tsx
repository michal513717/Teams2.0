import { useEffect, useState, Suspense } from 'react';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { RouterProvider } from "react-router-dom";
import { useAuth } from './hooks/useAuth';
import { mainRouter } from './routes';
import { authRouter } from './routes';
import theme from "./theme";
import './App.css'


const App: React.FC = () => {
  const { isAuthenticated, checkAuthStatus } = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // useEffect(() => {
  //   checkAuthStatus();
  // }, [isAuthenticated]);

  if (isAuthenticated === null) {
    return <p>loading</p>;
  }
  return (
    <>
      <Suspense fallback={<p>loading</p>}>
        <RouterProvider router={isAuthenticated ? mainRouter : authRouter} />
      </Suspense>
    </>
  );
}

export default () => (
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
