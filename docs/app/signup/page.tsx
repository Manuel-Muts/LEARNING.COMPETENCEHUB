import type { Metadata } from "next";
import AuthScreen from "../auth/auth-screen";

export const metadata: Metadata = {
  title: "Create an account | CompetenceHub",
  description: "Create a CompetenceHub learner account.",
};

export default function SignupPage() {
  return <AuthScreen mode="signup" />;
}
