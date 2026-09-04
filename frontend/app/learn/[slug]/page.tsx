import { notFound } from "next/navigation";
import { getLessonBySlug, getAllLessons } from "@/data/lessons";
import LessonClientWrapper from "./LessonClientWrapper";

interface LessonPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const lessons = getAllLessons();
  return lessons.map((lesson) => ({
    slug: lesson.slug,
  }));
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  const allLessons = getAllLessons();

  return (
    <LessonClientWrapper
      slug={slug}
      lesson={lesson}
      allLessons={allLessons}
    />
  );
}
