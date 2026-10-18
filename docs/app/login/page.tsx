import type { Metadata } from "next";
import AuthScreen from "../auth/auth-screen";

export const metadata: Metadata = {
  title: "Sign in | CompetenceHub",
  description: "Sign in to your CompetenceHub learner account.",
};

export default function LoginPage() {
  return <AuthScreen mode="login" />;
}
