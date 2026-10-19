import type { Metadata } from "next";
import AuthScreen from "../auth/auth-screen";

export const metadata: Metadata = {
  title: "Create a learner account",
  description: "Create a CompetenceHub account to practise school subjects, explore learning resources, and keep track of your progress.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupPage() {
  return <AuthScreen mode="signup" />;
}
