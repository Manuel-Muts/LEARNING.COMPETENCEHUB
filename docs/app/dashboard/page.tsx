import type { Metadata } from "next";
import DashboardPage from "./dashboard-view";

export const metadata: Metadata = {
  title: "Learner dashboard",
  description: "Your private CompetenceHub dashboard for choosing subjects, studying, and reviewing learning progress.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardRoute() {
  return <DashboardPage />;
}
