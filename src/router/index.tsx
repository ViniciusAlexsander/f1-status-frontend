import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import MeetingDetails from "../pages/MeetingDetails";
import NotFound from "../pages/NotFound";
import { AppLayout } from "@/pages/AppLayout";
import Standings from "@/pages/Standings";
import LiveTiming from "@/pages/LiveTiming";
import SessionDetails from "@/pages/SessionDetails";
import { GuideArticlePage } from "@/pages/content/GuideArticlePage";
import { StaticContentPage } from "@/pages/content/StaticContentPage";

const contentRoutes = [
  { path: "/sobre", element: <StaticContentPage /> },
  { path: "/contato", element: <StaticContentPage /> },
  { path: "/privacidade", element: <StaticContentPage /> },
  { path: "/como-funciona", element: <StaticContentPage /> },
  { path: "/guias", element: <StaticContentPage /> },
  { path: "/guias/:slug", element: <GuideArticlePage /> },
];

const devRoutes = import.meta.env.DEV
  ? [
      {
        path: "/dev/live-topics",
        lazy: async () => {
          const module = await import("@/pages/Dev/LiveTopicsDev");
          return { Component: module.default };
        },
      },
    ]
  : [];

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
      ...contentRoutes,
      ...devRoutes,
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
