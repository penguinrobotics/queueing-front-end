import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import "@radix-ui/themes/styles.css";

import AdminPage from "./AdminPage";
import KioskPage from "./KioskPage";
import QueuePage from "./QueuePage";
import { Theme } from "@radix-ui/themes";

TimeAgo.addDefaultLocale(en);

const router = createBrowserRouter([
  {
    path: "/admin",
    element: <AdminPage title="Queue - Admin" />,
    title: "Queue - Admin",
  },
  {
    path: "kiosk",
    element: <KioskPage />,
    title: "Queue - Kiosk",
  },
  {
    path: "queue",
    element: <QueuePage />,
    title: "Queue - Queue",
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Theme>
      <RouterProvider router={router} />
    </Theme>
  </React.StrictMode>
);
