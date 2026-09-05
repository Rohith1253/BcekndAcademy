"use client";

import React, { useEffect, useState, useRef } from "react";
import anime from "animejs";
import { Search, Filter, Compass, X, Code2 } from "lucide-react";
import { useClient } from "@/lib/store";
import { getApiUrl } from "@/lib/http";
import AnimatedBackground from "@/components/auth/AnimatedBackground";
import Footer from "@/components/Footer";
import CatalogHero from "@/components/courses/CatalogHero";
import ContinueLearningCard from "@/components/courses/ContinueLearningCard";
import CourseCard from "@/components/courses/CourseCard";
import CourseRoadmapSection from "@/components/courses/CourseRoadmapSection";
import RecommendedLearningPath from "@/components/courses/RecommendedLearningPath";

export default function CourseCatalogClient() {
  const { user } = useClient();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [userProgressMap, setUserProgressMap] = useState<Record<string, number>>({});

  const catalogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch(getApiUrl("/api/courses"));
        const json = await res.json();
        let loadedCourses: any[] = [];
        if (json.success && json.data?.courses) {
          loadedCourses = json.data.courses;
          setCourses(loadedCourses);
        }

        // Fetch authenticated user course progress map
        if (user && loadedCourses.length > 0) {
          const progMap: Record<string, number> = {};
          await Promise.all(
            loadedCourses.map(async (c: any) => {
              try {
                const pRes = await fetch(getApiUrl(`/api/courses/${c.slug}/progress`), {
                  credentials: "include",
                });
                const pJson = await pRes.json();
                if (pJson.success && pJson.data) {
                  if (typeof pJson.data.progressPercentage === "number") {
                    progMap[c.slug] = pJson.data.progressPercentage;
                  } else if (Array.isArray(pJson.data.progress)) {
                    const completed = pJson.data.progress.filter(
                      (p: any) => p.status === "completed"
                    ).length;
                    const total = c.totalLessons || 12;
                    progMap[c.slug] = Math.min(100, Math.round((completed / total) * 100));
                  } else {
                    progMap[c.slug] = 0;
                  }
                }
              } catch {
                progMap[c.slug] = 0;
              }
            })
          );
          setUserProgressMap(progMap);
        }
      } catch (err) {
        console.error("Fetch courses error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, [user]);

  // Subtle entrance animation for cards
  useEffect(() => {
    if (loading || !catalogRef.current) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const cards = catalogRef.current.querySelectorAll(".course-card");
    if (cards.length === 0) return;

    const anim = anime({
      targets: cards,
      opacity: [0, 1],
      translateY: [16, 0],
      delay: anime.stagger(50, { start: 40 }),
      duration: 550,
      easing: "easeOutCubic",
    });

    return () => {
      anim.pause();
      anime.remove(cards);
    };
  }, [loading, selectedLanguage, selectedCategory, selectedDifficulty, searchQuery]);

  const languages = [
    "All",
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C#",
    "Go",
    "PHP",
    "Rust",
    "Ruby",
    "Kotlin",
    "Elixir",
  ];
  const categories = ["All", "Language", "Framework", "Database", "Security"];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  // Filter courses client-side using existing metadata and language
  const filteredCourses = courses.filter((course) => {
    const courseLang = (course.language || "javascript").toLowerCase();
    const selLang = selectedLanguage.toLowerCase();
    const matchesLanguage =
      selectedLanguage === "All" ||
      courseLang === selLang ||
      (selectedLanguage === "C#" && (courseLang === "csharp" || courseLang === "c#"));

    const cat = course.category?.toLowerCase() || "";
    const matchesCategory =
      selectedCategory === "All" ||
      cat.includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === "Database" && cat.includes("mongodb"));

    const diff = (course.difficulty || course.level || "").toLowerCase();
    const matchesDifficulty =
      selectedDifficulty === "All" ||
      diff.includes(selectedDifficulty.toLowerCase());

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      course.title?.toLowerCase().includes(query) ||
      course.description?.toLowerCase().includes(query) ||
      course.shortDescription?.toLowerCase().includes(query) ||
      course.frameworks?.some((f: string) => f.toLowerCase().includes(query)) ||
      course.tags?.some((t: string) => t.toLowerCase().includes(query));

    return matchesLanguage && matchesCategory && matchesDifficulty && matchesSearch;
  }).sort((a, b) => (a.order || 99) - (b.order || 99));

  // Calculate dynamic curriculum statistics across available courses
  const totalCoursesCount = courses.length || 26;
  const totalModulesCount = courses.reduce((acc, c) => acc + (c.totalModules || 4), 0);
  const totalLessonsCount = courses.reduce((acc, c) => acc + (c.totalLessons || 12), 0);
  const totalXPCount = courses.reduce((acc, c) => acc + (c.totalXP || 1800), 0);

  // Find user's active in-progress course or recommend the first course
  const inProgressCourse = courses.find((c) => {
    const prog = userProgressMap[c.slug] ?? 0;
    return prog > 0 && prog < 100;
  });

  const recommendedCourse =
    courses.find((c) => c.slug === "backend-node-js") || courses[0];

  const activeProgress = inProgressCourse
    ? userProgressMap[inProgressCourse.slug] || 0
    : 0;

  return (
    <div className="relative min-h-screen bg-[#070913] text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient Dark Glowing Orbs Background */}
      <AnimatedBackground />

      <div className="relative z-10 pt-8 sm:pt-10 pb-24">
        <div ref={catalogRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* ================= SECTION 1: LEARNING HERO ================= */}
          <CatalogHero
            totalCourses={totalCoursesCount}
            totalModules={totalModulesCount}
            totalLessons={totalLessonsCount}
            totalXP={totalXPCount}
          />

          {/* ================= SECTION 2: CONTINUE LEARNING ================= */}
          <ContinueLearningCard
            activeCourse={inProgressCourse || null}
            activeProgress={activeProgress}
            recommendedCourse={recommendedCourse}
            user={user}
          />

          {/* ================= SECTION 3: RECOMMENDED LEARNING PATH ================= */}
          <div id="learning-path" className="scroll-mt-24">
            <RecommendedLearningPath
              courses={courses}
              userProgressMap={userProgressMap}
              isAuthenticated={Boolean(user)}
            />
          </div>

          {/* ================= SECTION 4: COURSE DISCOVERY HEADER & FILTERS ================= */}
          <div id="all-courses" className="space-y-6 scroll-mt-24 pt-8 border-t border-white/[0.08]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Individual Courses Catalog
                </p>
                <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Explore All Courses
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-400">
                  Filter by category, skill level, or search individual curriculum modules.
                </p>
              </div>

              {/* Real-Time Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  aria-label="Search courses"
                  placeholder="Search courses, tags, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/90 border border-white/[0.12] pl-10 pr-9 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/25"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Buttons Bar */}
            <div className="rounded-xl border border-white/[0.08] bg-slate-900/80 p-4 shadow-sm space-y-3.5">
              {/* Language Tabs Row */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mr-1 flex items-center gap-1 shrink-0">
                  <Code2 className="w-3.5 h-3.5" />
                  Language:
                </span>
                {languages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setSelectedLanguage(lang)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer shrink-0 ${
                      selectedLanguage === lang
                        ? "bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/10"
                        : "bg-slate-950/80 text-slate-400 border border-white/[0.06] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {/* Category & Difficulty Filters Sub-Row */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between pt-2 border-t border-white/[0.06]">
                {/* Category Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1 shrink-0">
                    <Filter className="w-3 h-3" />
                    Category:
                  </span>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer shrink-0 ${
                        selectedCategory === cat
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm"
                          : "bg-slate-900/80 text-slate-400 border border-white/[0.06] hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Difficulty Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1 shrink-0">
                    <Compass className="w-3 h-3" />
                    Level:
                  </span>
                  {difficulties.map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer shrink-0 ${
                        selectedDifficulty === diff
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                          : "bg-slate-900/80 text-slate-400 border border-white/[0.06] hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ================= SECTION 4, 5, 6, 7, 9: COURSE GRID & EMPTY SPACE FIX ================= */}
          {loading ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center text-slate-400 gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
              <p className="text-xs font-mono tracking-wider">Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-slate-900/80 p-12 text-center text-slate-400 space-y-4">
              <Code2 className="mx-auto h-10 w-10 text-slate-500" />
              <p className="text-lg font-bold text-white">No courses match your filter criteria</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try searching for another keyword or resetting your category and level filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedDifficulty("All");
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 px-5 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            /* Responsive Grid: Balanced proportions without awkward empty holes */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.slug}
                  course={course}
                  progress={userProgressMap[course.slug] || 0}
                  isAuthenticated={Boolean(user)}
                />
              ))}
            </div>
          )}

          {/* ================= SECTION 8: LEARNING PATH ROADMAP VISUAL ================= */}
          <CourseRoadmapSection
            courses={courses}
            userProgressMap={userProgressMap}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
