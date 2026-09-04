import CourseLessonWorkspace from "@/components/lesson/CourseLessonWorkspace";

interface PageProps {
  params: Promise<{
    slug: string;
    lessonSlug: string;
  }>;
}

export default async function CourseLessonPage({ params }: PageProps) {
  const { slug, lessonSlug } = await params;
  return <CourseLessonWorkspace courseSlug={slug} lessonSlug={lessonSlug} />;
}
