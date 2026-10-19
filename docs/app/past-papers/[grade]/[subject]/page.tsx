import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findGrade, getPastPaperSubjects, slugifyCurriculumLabel } from "@/lib/curriculum";
import { SITE_URL } from "@/lib/site";
import PastPapersClient from "./past-papers-client";

type PastPapersPageProps = {
  params: Promise<{ grade: string; subject: string }>;
};

export async function generateMetadata({
  params,
}: PastPapersPageProps): Promise<Metadata> {
  const { grade: gradeId, subject: subjectId } = await params;
  const grade = findGrade(gradeId);
  const subject = grade && getPastPaperSubjects(grade).find(
    (candidate) => slugifyCurriculumLabel(candidate) === subjectId,
  );

  if (!grade || !subject) {
    notFound();
  }

  const title = `${subject} past papers for ${grade.label}`;
  return {
    title,
    description: `Find ${grade.label} ${subject} past papers and revision materials for Kenyan CBC learners. Browse available papers by subject and year.`,
    keywords: [
      `${grade.label} ${subject} past papers`,
      `Kenya ${subject} past papers`,
      `CBC ${grade.label} revision`,
      `${subject} revision papers`,
    ],
    alternates: {
      canonical: `${SITE_URL}/past-papers/${grade.id}/${slugifyCurriculumLabel(subject)}`,
    },
  };
}

export default async function PastPapersPage({
  params,
}: PastPapersPageProps) {
  const { grade: gradeId, subject: subjectId } = await params;
  const grade = findGrade(gradeId);
  const subject = grade && getPastPaperSubjects(grade).find(
    (candidate) => slugifyCurriculumLabel(candidate) === subjectId,
  );

  if (!grade || !subject) {
    notFound();
  }

  return <PastPapersClient gradeId={grade.id} gradeLabel={grade.label} subject={subject} />;
}
