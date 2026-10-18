import type { Metadata } from "next";
import RouteProgress from "./route-progress";
import "./globals.css";

export const metadata: Metadata = {
  title: "CompetenceHub | Your learning space",
  description:
    "A welcoming space to learn, practise, and keep track of your progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RouteProgress />
        {children}
      </body>
    </html>
  );
}
