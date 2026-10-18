import { slugifyCurriculumLabel } from "./curriculum";
import { getCachedRequest } from "./request-cache";

const LEARNER_PAST_PAPERS_CACHE_TTL_MS = 30_000;

export type PastPaper = {
  title: string;
  year: number;
  pdfUrl: string;
};

export type ManagedPastPaper = PastPaper & {
  id: string;
  gradeId: string;
  subject: string;
  filename: string;
  contentType: string;
  createdAt: string;
};

export type PaginatedManagedPastPapers = {
  items: ManagedPastPaper[];
  total: number;
  page: number;
  pageSize: number;
};

const pastPapersByGrade: Record<string, Record<string, PastPaper[]>> = {};
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"
).replace(/\/+$/, "");

export function getPastPapers(gradeId: string, subject: string): PastPaper[] {
  return pastPapersByGrade[gradeId]?.[slugifyCurriculumLabel(subject)] ?? [];
}

export async function fetchManagedPastPapers(
  gradeId?: string,
  subject?: string,
): Promise<ManagedPastPaper[]> {
  const query = new URLSearchParams();
  if (gradeId) query.set("grade_id", gradeId);
  if (subject) query.set("subject", subject);
  const suffix = query.size ? `?${query.toString()}` : "";
  return getCachedRequest(
    `learner:past-papers:list:${suffix}`,
    async () => {
      const response = await fetch(`${API_URL}/past-papers${suffix}`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Past papers could not be loaded (${response.status}).`);
      }
      const papers = (await response.json()) as {
        id: string;
        title: string;
        grade_id: string;
        subject: string;
        year: number;
        filename: string;
        content_type: string;
        created_at: string;
      }[];
      return papers.map((paper) => ({
        id: paper.id,
        title: paper.title,
        year: paper.year,
        gradeId: paper.grade_id,
        subject: paper.subject,
        filename: paper.filename,
        contentType: paper.content_type,
        createdAt: paper.created_at,
        pdfUrl: `${API_URL}/past-papers/${paper.id}/file`,
      }));
    },
    LEARNER_PAST_PAPERS_CACHE_TTL_MS,
  );
}

export async function fetchManagedPastPapersPage(
  gradeId: string,
  subject: string,
  page: number,
): Promise<PaginatedManagedPastPapers> {
  const query = new URLSearchParams({
    grade_id: gradeId,
    subject,
    page: String(page),
  });
  return getCachedRequest(
    `learner:past-papers:page:${query.toString()}`,
    async () => {
      const response = await fetch(`${API_URL}/past-papers/page?${query.toString()}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`Past papers could not be loaded (${response.status}).`);
      }
      const result = (await response.json()) as {
        items: {
          id: string;
          title: string;
          grade_id: string;
          subject: string;
          year: number;
          filename: string;
          content_type: string;
          created_at: string;
        }[];
        total: number;
        page: number;
        page_size: number;
      };
      return {
        items: result.items.map((paper) => ({
          id: paper.id,
          title: paper.title,
          year: paper.year,
          gradeId: paper.grade_id,
          subject: paper.subject,
          filename: paper.filename,
          contentType: paper.content_type,
          createdAt: paper.created_at,
          pdfUrl: `${API_URL}/past-papers/${paper.id}/file`,
        })),
        total: result.total,
        page: result.page,
        pageSize: result.page_size,
      };
    },
    LEARNER_PAST_PAPERS_CACHE_TTL_MS,
  );
}
