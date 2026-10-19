import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { lessons } from "@/lib/lessons";
import { SITE_URL } from "@/lib/site";
import PracticeClient from "./practice-client";

type DemoPracticePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: DemoPracticePageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = lessons[slug];

  if (!lesson) {
    notFound();
  }

  return {
    title: `${lesson.title} practice`,
    description: `${lesson.description} Try this free ${lesson.subject.toLowerCase()} practice lesson on CompetenceHub.`,
    keywords: [
      lesson.title,
      `${lesson.subject.toLowerCase()} practice`,
      "Kenya CBC learning",
      "free school revision questions",
    ],
    alternates: {
      canonical: `${SITE_URL}/demo/${lesson.slug}`,
    },
  };
}

export default async function DemoPracticePage({
  params,
}: DemoPracticePageProps) {
  const { slug } = await params;
  const lesson = lessons[slug];

  if (!lesson) {
    notFound();
  }

  return <PracticeClient lesson={lesson} />;
}
