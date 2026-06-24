import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import MeetingDetails from "../pages/MeetingDetails";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/meetings/:id",
    element: <MeetingDetails />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
