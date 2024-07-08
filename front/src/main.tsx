import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './demos/ipc'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const aplicationRouter = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
]);

const authRouter = createBrowserRouter([
  {
    path:"/",
    element:<LoginScreen/>
  },
  {
    path:"/register",
    element:<RegisterScreen/>
  }  
])


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={authRouter}/>
  </React.StrictMode>,
)

postMessage({ payload: 'removeLoading' }, '*')
