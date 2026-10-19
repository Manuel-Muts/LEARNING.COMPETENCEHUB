import type { Metadata } from "next";
import AuthScreen from "../auth/auth-screen";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your CompetenceHub account to continue learning and track your study progress.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <AuthScreen mode="login" />;
}
