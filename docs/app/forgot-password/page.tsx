import type { Metadata } from "next";
import AuthScreen from "../auth/auth-screen";

export const metadata: Metadata = {
  title: "Reset password | CompetenceHub",
  description: "Reset your CompetenceHub learner account password.",
};

export default function ForgotPasswordPage() {
  return <AuthScreen mode="reset" />;
}
