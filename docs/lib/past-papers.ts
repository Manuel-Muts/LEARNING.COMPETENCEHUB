import { slugifyCurriculumLabel } from "./curriculum";

export type PastPaper = {
  title: string;
  year: number;
  pdfUrl: string;
};

const pastPapersByGrade: Record<string, Record<string, PastPaper[]>> = {};

export function getPastPapers(gradeId: string, subject: string): PastPaper[] {
  return pastPapersByGrade[gradeId]?.[slugifyCurriculumLabel(subject)] ?? [];
}
