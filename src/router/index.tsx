import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import MeetingDetails from "../pages/MeetingDetails";
import NotFound from "../pages/NotFound";
import { AppLayout } from "@/pages/AppLayout";
import Standings from "@/pages/Standings";
import LiveTiming from "@/pages/LiveTiming";
import SessionDetails from "@/pages/SessionDetails";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/meetings/:id",
        element: <MeetingDetails />,
      },
      {
        path: "/meetings/:meetingsId/sessions/:sessionId",
        element: <SessionDetails />,
      },
      {
        path: "/standings",
        element: <Standings />,
      },
      {
        path: "/live",
        element: <LiveTiming />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
