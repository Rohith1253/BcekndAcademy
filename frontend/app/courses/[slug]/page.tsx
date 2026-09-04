import { notFound } from "next/navigation";
import CourseDetailClient from "./CourseDetailClient";

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;

  return <CourseDetailClient slug={slug} />;
}
