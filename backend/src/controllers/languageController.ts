import { Request, Response } from "express";
import { BACKEND_LANGUAGES, getBackendLanguage } from "../data/backend-languages";
import { getComparisonPair, LANGUAGE_COMPARISON_METRICS } from "../data/language-comparisons";
import { Course } from "../models/Course";

/**
 * GET /api/backend-languages
 * Returns all supported backend languages enriched with live course counts from MongoDB.
 */
export async function getLanguages(req: Request, res: Response) {
  try {
    // Count courses per language dynamically from MongoDB
    const courseCounts = await Course.aggregate([
      { $match: { published: true } },
      { $group: { _id: "$language", count: { $sum: 1 }, totalLessons: { $sum: "$totalLessons" }, totalXP: { $sum: "$totalXP" } } },
    ]);

    const countMap: Record<string, { count: number; totalLessons: number; totalXP: number }> = {};
    courseCounts.forEach((item) => {
      if (item._id) {
        countMap[item._id.toLowerCase()] = {
          count: item.count,
          totalLessons: item.totalLessons || 0,
          totalXP: item.totalXP || 0,
        };
      }
    });

    const enrichedLanguages = BACKEND_LANGUAGES.map((lang) => {
      const stats = countMap[lang.id] || countMap[lang.slug] || { count: 0, totalLessons: 0, totalXP: 0 };
      return {
        ...lang,
        courseCount: stats.count,
        totalLessons: stats.totalLessons,
        totalXP: stats.totalXP,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        languages: enrichedLanguages,
        totalLanguages: enrichedLanguages.length,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch languages" });
  }
}

/**
 * GET /api/backend-languages/:slug
 * Returns detailed language metadata, frameworks, roadmap, and associated courses.
 */
export async function getLanguageBySlug(req: Request, res: Response) {
  try {
    const rawSlug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const cleanSlug = String(rawSlug || "").toLowerCase().trim();
    const language = getBackendLanguage(cleanSlug);

    if (!language) {
      return res.status(404).json({ success: false, error: `Backend language '${rawSlug}' not found` });
    }

    // Fetch all courses associated with this language from MongoDB
    const courses = await Course.find({
      language: language.id,
      published: true,
    })
      .sort({ order: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        language,
        courses,
        totalCourses: courses.length,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to fetch language details" });
  }
}

/**
 * GET /api/backend-languages/compare?lang1=python&lang2=javascript
 * Returns comparative architectural ratings and side-by-side analysis.
 */
export async function getLanguageComparison(req: Request, res: Response) {
  try {
    const lang1 = ((req.query.lang1 as string) || "python").toLowerCase().trim();
    const lang2 = ((req.query.lang2 as string) || "javascript").toLowerCase().trim();

    const lang1Def = getBackendLanguage(lang1);
    const lang2Def = getBackendLanguage(lang2);

    if (!lang1Def || !lang2Def) {
      return res.status(400).json({
        success: false,
        error: "Please specify two valid backend language slugs to compare (e.g. ?lang1=python&lang2=go)",
      });
    }

    const comparison = getComparisonPair(lang1, lang2);

    return res.status(200).json({
      success: true,
      data: {
        lang1: lang1Def,
        lang2: lang2Def,
        metrics: comparison.metrics,
        allCategories: LANGUAGE_COMPARISON_METRICS,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || "Failed to compare languages" });
  }
}
