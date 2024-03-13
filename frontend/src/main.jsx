import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { CurrentUserContextProvider } from "./contexte/CurrentUserContext";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <CurrentUserContextProvider>
    <RouterProvider router={App} />
  </CurrentUserContextProvider>
);
