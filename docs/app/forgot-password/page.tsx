import type { Metadata } from "next";
import AuthScreen from "../auth/auth-screen";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Securely reset the password for your CompetenceHub learner account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return <AuthScreen mode="reset" />;
}
