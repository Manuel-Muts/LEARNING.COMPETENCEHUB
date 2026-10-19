import type { MetadataRoute } from "next";
import { grades, getPastPaperSubjects, slugifyCurriculumLabel } from "@/lib/curriculum";
import { lessons } from "@/lib/lessons";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const learningPages = grades.flatMap((grade) =>
    grade.subjects.map((subject) => ({
      url: `${SITE_URL}/learn/${grade.id}/${slugifyCurriculumLabel(subject)}`,
      changeFrequency: "monthly" as const,
      priority: grade.band === "Junior school" ? 0.8 : 0.7,
    })),
  );
  const pastPaperPages = grades.flatMap((grade) =>
    getPastPaperSubjects(grade).map((subject) => ({
      url: `${SITE_URL}/past-papers/${grade.id}/${slugifyCurriculumLabel(subject)}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  );
  const demoPages = Object.keys(lessons).map((slug) => ({
    url: `${SITE_URL}/demo/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...learningPages, ...pastPaperPages, ...demoPages];
}
