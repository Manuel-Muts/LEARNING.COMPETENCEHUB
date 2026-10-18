import type { Metadata } from "next";
import type { ReactNode } from "react";
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
  children: ReactNode;
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
