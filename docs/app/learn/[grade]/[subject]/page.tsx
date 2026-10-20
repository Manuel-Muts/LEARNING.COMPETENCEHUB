import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findGrade, getSampleQuestion, slugifyCurriculumLabel } from "@/lib/curriculum";
import { getJuniorCompositions } from "@/lib/junior-compositions";
import { getJuniorQuestions } from "@/lib/junior-question-bank";
import { getUpperPrimaryCompositions } from "@/lib/upper-primary-compositions";
import { getUpperPrimaryQuestions } from "@/lib/upper-primary-question-bank";
import { SITE_URL } from "@/lib/site";
import SubjectPracticeClient from "./subject-practice-client";

type SubjectPageProps = {
  params: Promise<{ grade: string; subject: string }>;
};

export async function generateMetadata({
  params,
}: SubjectPageProps): Promise<Metadata> {
  const { grade: gradeId, subject: subjectId } = await params;
  const grade = findGrade(gradeId);
  const subject = grade?.subjects.find(
    (candidate) => slugifyCurriculumLabel(candidate) === subjectId,
  );

  if (!grade || !subject) {
    notFound();
  }

  const isKiswahili = subject === "Kiswahili";
  const hasUpperPrimaryWritingModels =
    grade.band === "Upper primary" && (subject === "English" || isKiswahili);
  const title = isKiswahili
    ? `Kiswahili insha and practice for ${grade.label}`
    : hasUpperPrimaryWritingModels
      ? `English composition and practice for ${grade.label}`
    : `${subject} practice and revision for ${grade.label}`;
  return {
    title,
    description: isKiswahili
      ? `Jifunze Kiswahili kwa ${grade.label} kupitia mazoezi ya lugha, maswali ya marudio na mifano ya insha kulingana na mtaala wa CBC Kenya.`
      : hasUpperPrimaryWritingModels
        ? `Study English for ${grade.label} with Kenya CBC practice questions and original model compositions for writing practice.`
      : `Study ${subject} for ${grade.label} with Kenya CBC practice questions, revision activities, and helpful learning examples.`,
    keywords: isKiswahili
      ? [
          `Kiswahili ${grade.label}`,
          `insha za ${grade.label}`,
          "mifano ya insha za Kiswahili",
          "maswali ya Kiswahili CBC",
          "mazoezi ya Kiswahili Kenya",
        ]
      : [
          `${subject} ${grade.label}`,
          `${grade.label} ${subject} revision`,
          `CBC ${subject} practice Kenya`,
          `Kenya ${subject} questions`,
        ],
    alternates: {
      canonical: `${SITE_URL}/learn/${grade.id}/${slugifyCurriculumLabel(subject)}`,
    },
  };
}

export default async function SubjectPracticePage({
  params,
}: SubjectPageProps) {
  const { grade: gradeId, subject: subjectId } = await params;
  const grade = findGrade(gradeId);
  const subject = grade?.subjects.find(
    (candidate) => slugifyCurriculumLabel(candidate) === subjectId,
  );

  if (!grade || !subject) {
    notFound();
  }

  if (grade.band === "Upper primary") {
    const questions = getUpperPrimaryQuestions(grade.id, subject);
    if (!questions) {
      notFound();
    }
    const compositions = getUpperPrimaryCompositions(grade.id, subject);
    if (compositions) {
      return (
        <SubjectPracticeClient
          mode="language"
          gradeId={grade.id}
          grade={grade.label}
          subject={subject}
          questions={questions}
          compositions={compositions}
        />
      );
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

  if (grade.band === "Junior school") {
    const questions = getJuniorQuestions(grade.id, subject);
    if (!questions) {
      notFound();
    }
    const compositions = getJuniorCompositions(grade.id, subject);
    if (compositions) {
      return (
        <SubjectPracticeClient
          mode="language"
          gradeId={grade.id}
          grade={grade.label}
          subject={subject}
          questions={questions}
          compositions={compositions}
        />
      );
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
