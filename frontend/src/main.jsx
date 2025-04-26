import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

//External Libs
//Fontawesome
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
//Bootstrap
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.js";


//App outlet
import App from "./App";
import './assets/fonts/uU9NCBsR6Z2vfE9aq3bh0NSDqFeedTMXxPQ.woff2'
import './assets/fonts/uU9NCBsR6Z2vfE9aq3bh2dSDqFeedTMXxPQ.woff2'
import './assets/fonts/uU9NCBsR6Z2vfE9aq3bh0dSDqFeedTMXxPQ.woff2'
import './assets/fonts/uU9NCBsR6Z2vfE9aq3bh3tSDqFeedTMXxPQ.woff2'
import './assets/fonts/uU9NCBsR6Z2vfE9aq3bh09SDqFeedTMXxPQ.woff2'
import './assets/fonts/uU9NCBsR6Z2vfE9aq3bh3dSDqFeedTMX.woff2'
import './main.css'

//pages
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import Landing from "./pages/Landing/Landing.jsx";

let router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Navigate to="/" replace />,
    children: [
      {
        path: "/",
        index: true,
        element: <Landing />,
      },
      {
        element: <App />,
        children: [
          {
            path: "/dashboard",
            element: <Home />,
          },
          {
            path: "/w/:viewID",
            element: <Dashboard />,
          },
        ]
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
);
