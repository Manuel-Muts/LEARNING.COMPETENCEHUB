import { notFound } from "next/navigation";
import { findGrade, getPastPaperSubjects, slugifyCurriculumLabel } from "@/lib/curriculum";
import PastPapersClient from "./past-papers-client";

export default async function PastPapersPage({
  params,
}: {
  params: Promise<{ grade: string; subject: string }>;
}) {
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
