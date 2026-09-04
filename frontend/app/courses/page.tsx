import CourseCatalogClient from "./CourseCatalogClient";

export const metadata = {
  title: "Course Catalog | Backend Academy",
  description:
    "Explore 5 structured, production-grade backend engineering courses covering Node.js, TypeScript, Express, MongoDB, and Security Hardening.",
};

export default function CoursesCatalogPage() {
  return <CourseCatalogClient />;
}
