import { notFound } from "next/navigation";
import { lessons } from "@/lib/lessons";
import PracticeClient from "./practice-client";

export default async function DemoPracticePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = lessons[slug];

  if (!lesson) {
    notFound();
  }

  return <PracticeClient lesson={lesson} />;
}
