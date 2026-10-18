import { notFound } from "next/navigation";
import { findGrade, getSampleQuestion, slugifyCurriculumLabel } from "@/lib/curriculum";
import { getJuniorQuestions } from "@/lib/junior-question-bank";
import SubjectPracticeClient from "./subject-practice-client";

export default async function SubjectPracticePage({
  params,
}: {
  params: Promise<{ grade: string; subject: string }>;
}) {
  const { grade: gradeId, subject: subjectId } = await params;
  const grade = findGrade(gradeId);
  const subject = grade?.subjects.find(
    (candidate) => slugifyCurriculumLabel(candidate) === subjectId,
  );

  if (!grade || !subject) {
    notFound();
  }

  if (grade.band === "Junior school") {
    const questions = getJuniorQuestions(grade.id, subject);
    if (!questions) {
      notFound();
    }
    return (
      <SubjectPracticeClient
        mode="practice"
        gradeId={grade.id}
        grade={grade.label}
        subject={subject}
        questions={questions}
      />
    );
  }

  const question = getSampleQuestion(grade, subject);
  if (!question) {
    notFound();
  }
  return (
    <SubjectPracticeClient
      mode="sample"
      grade={grade.label}
      subject={subject}
      question={question}
    />
  );
}
