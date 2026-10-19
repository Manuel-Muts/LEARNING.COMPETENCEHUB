import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_URL } from "@/lib/site";
import RouteProgress from "./route-progress";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CompetenceHub | Learning and revision for Kenyan learners",
    template: "%s | CompetenceHub",
  },
  description:
    "Explore CBC learning resources, revision practice, English compositions, Kiswahili insha, and past papers for Kenyan learners.",
  keywords: [
    "CBC learning resources Kenya",
    "Kenyan learners",
    "Grade 7 revision",
    "Grade 8 revision",
    "Grade 9 revision",
    "English composition examples",
    "Kiswahili insha mifano",
    "Kenya past papers",
    "junior school practice questions",
  ],
  openGraph: {
    type: "website",
    siteName: "CompetenceHub",
    title: "CompetenceHub | Learning and revision for Kenyan learners",
    description:
      "Explore CBC learning resources, revision practice, English compositions, Kiswahili insha, and past papers for Kenyan learners.",
    url: SITE_URL,
  },
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
