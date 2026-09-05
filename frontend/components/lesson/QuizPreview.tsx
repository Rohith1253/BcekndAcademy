"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, Trophy, Zap, HelpCircle, AlertCircle } from "lucide-react";
import type { QuizQuestion } from "@/data/lessons/types";
import { useClient } from "@/lib/store";
import { api } from "@/lib/api";

interface QuizPreviewProps {
  questions: QuizQuestion[] | { questions?: QuizQuestion[]; xpReward?: number } | any;
  xpReward?: number;
  lessonId?: string;
}

export default function QuizPreview({ questions = [], xpReward = 50, lessonId }: QuizPreviewProps) {
  const { user, refreshUser } = useClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serverResult, setServerResult] = useState<{
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    xpEarned: number;
    alreadyCompleted: boolean;
    message?: string;
  } | null>(null);

  const normalizedQuestions: QuizQuestion[] = Array.isArray(questions)
    ? questions
    : questions && Array.isArray((questions as any).questions)
    ? (questions as any).questions
    : [];

  if (!normalizedQuestions || normalizedQuestions.length === 0) {
    return null;
  }

  // Safe question key generator to handle any question object schema (id, _id, or index)
  const getQuestionKey = (q: QuizQuestion, index: number): string => {
    if (q && q.id) return String(q.id);
    if (q && (q as any)._id) return String((q as any)._id);
    return `q-${index}`;
  };

  const currentQuestion = normalizedQuestions[currentIndex];
  const currentKey = currentQuestion ? getQuestionKey(currentQuestion, currentIndex) : `q-${currentIndex}`;
  const currentAnswer = answers[currentKey];
  const isQuestionAnswered = currentAnswer !== undefined;

  const handleSelectOption = (optionIndex: number) => {
    if (!submitted) {
      setValidationError(null);
      setAnswers((prev) => ({ ...prev, [currentKey]: optionIndex }));
    }
  };

  const handleNextQuestion = () => {
    setValidationError(null);
    if (currentIndex < normalizedQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    setValidationError(null);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Find index of first unanswered question
  const getFirstUnansweredIndex = (): number => {
    for (let i = 0; i < normalizedQuestions.length; i++) {
      const key = getQuestionKey(normalizedQuestions[i], i);
      if (answers[key] === undefined) return i;
    }
    return -1;
  };

  const handleSubmitQuiz = async () => {
    if (submitting) return;
    setValidationError(null);

    // Check if all questions are answered
    const firstUnanswered = getFirstUnansweredIndex();
    if (firstUnanswered !== -1) {
      setCurrentIndex(firstUnanswered);
      setValidationError(`Please answer Question ${firstUnanswered + 1} before submitting the quiz.`);
      return;
    }

    setSubmitting(true);

    try {
      const formattedAnswers = normalizedQuestions.map((q, idx) => {
        const key = getQuestionKey(q, idx);
        return {
          questionId: q.id || key,
          selectedOptionIndex: answers[key] ?? -1,
        };
      });

      // Calculate client-side fallback breakdown
      let correctCount = 0;
      normalizedQuestions.forEach((q, idx) => {
        const key = getQuestionKey(q, idx);
        const expected = q.correctOptionIndex !== undefined ? q.correctOptionIndex : (q as any).correct;
        if (answers[key] === expected) correctCount++;
      });
      const clientScore = Math.round((correctCount / normalizedQuestions.length) * 100);

      if (user && lessonId) {
        const json = await api.post("/api/quiz/submit", {
          lessonId,
          answers: formattedAnswers,
          timeSpent: 45,
        }).catch(() => null);

        if (json?.success && json.data?.result) {
          setServerResult({
            score: json.data.result.score,
            correctAnswers: json.data.result.correctAnswers,
            totalQuestions: json.data.result.totalQuestions,
            xpEarned: json.data.result.xpEarned,
            alreadyCompleted: json.data.result.alreadyCompleted,
            message: json.message,
          });
          await refreshUser();
        } else {
          setServerResult({
            score: clientScore,
            correctAnswers: correctCount,
            totalQuestions: normalizedQuestions.length,
            xpEarned: clientScore >= 60 ? xpReward : 0,
            alreadyCompleted: false,
          });
        }
      } else {
        setServerResult({
          score: clientScore,
          correctAnswers: correctCount,
          totalQuestions: normalizedQuestions.length,
          xpEarned: clientScore >= 60 ? xpReward : 0,
          alreadyCompleted: false,
        });
      }
      setSubmitted(true);
    } catch (e) {
      console.error("Quiz submit error:", e);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIndex(0);
    setSubmitted(false);
    setServerResult(null);
    setValidationError(null);
  };

  const answeredCount = Object.keys(answers).filter(
    (k) => answers[k] !== undefined
  ).length;

  return (
    <section className="my-8 rounded-[2rem] border border-white/10 bg-slate-950/80 p-5 sm:p-8 shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-300">
            Assessment Checkpoint
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-white">Lesson Assessment Quiz</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-900 px-4 py-2 rounded-full border border-white/10">
          <HelpCircle className="h-4 w-4 text-cyan-300 shrink-0" />
          <span>{normalizedQuestions.length} Questions (+{xpReward} XP)</span>
        </div>
      </div>

      {/* Validation Error Toast Banner */}
      {validationError && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200 text-xs sm:text-sm font-medium">
          <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Quiz Summary View after submission */}
      {submitted && serverResult ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 sm:p-8 text-center backdrop-blur-xl">
            <Trophy
              className={`mx-auto h-16 w-16 ${
                serverResult.score >= 60 ? "text-emerald-400 animate-bounce" : "text-amber-400"
              }`}
            />
            <h3 className="mt-4 text-3xl font-semibold text-white">
              {serverResult.score >= 80
                ? "Mastery Achieved!"
                : serverResult.score >= 60
                ? "Assessment Passed!"
                : "Needs Review"}
            </h3>
            <p className="mt-2 text-slate-300">
              You scored <span className="font-semibold text-cyan-300">{serverResult.score}%</span> ({serverResult.correctAnswers} of {serverResult.totalQuestions} correct)
            </p>

            {/* Server XP Badge */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet-500/20 px-5 py-2 text-sm font-semibold text-violet-300 border border-violet-500/30">
              <Zap className="h-4 w-4 text-violet-300 shrink-0" />
              <span>
                {serverResult.alreadyCompleted
                  ? "Previously Passed (0 additional XP)"
                  : `+${serverResult.xpEarned} XP Earned`}
              </span>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition"
              >
                <RotateCcw className="h-4 w-4" /> Retry Assessment
              </button>
            </div>
          </div>

          {/* Question-by-Question Review Breakdown */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white">Detailed Answer Breakdown & Explanations</h4>
            {normalizedQuestions.map((q, idx) => {
              const qKey = getQuestionKey(q, idx);
              const userSelected = answers[qKey];
              const expectedCorrect = q.correctOptionIndex !== undefined ? q.correctOptionIndex : (q as any).correct;
              const isCorrect = userSelected === expectedCorrect;

              return (
                <div
                  key={qKey}
                  className={`rounded-2xl border p-5 sm:p-6 transition ${
                    isCorrect ? "border-emerald-500/30 bg-emerald-500/5" : "border-rose-500/30 bg-rose-500/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Question {idx + 1}
                      </span>
                      <h5 className="mt-1 text-base sm:text-lg font-medium text-white">{q.question}</h5>
                    </div>
                    {isCorrect ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="h-6 w-6 text-rose-400 shrink-0" />
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isUserChoice = userSelected === optIdx;
                      const isCorrectChoice = expectedCorrect === optIdx;

                      return (
                        <div
                          key={optIdx}
                          className={`rounded-xl px-4 py-2.5 text-xs font-medium border flex items-center justify-between gap-2 ${
                            isCorrectChoice
                              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-200"
                              : isUserChoice
                              ? "bg-rose-500/20 border-rose-500/40 text-rose-200"
                              : "bg-slate-900/60 border-white/5 text-slate-400"
                          }`}
                        >
                          <span className="leading-snug">{opt}</span>
                          {isCorrectChoice && <span className="text-[10px] uppercase font-bold text-emerald-300 shrink-0">✓ Correct</span>}
                          {isUserChoice && !isCorrectChoice && <span className="text-[10px] uppercase font-bold text-rose-300 shrink-0">Your Choice</span>}
                        </div>
                      );
                    })}
                  </div>

                  <p className="mt-4 text-xs leading-6 text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-white/5">
                    💡 <strong className="text-slate-200">Explanation:</strong> {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      ) : (
        /* Active Question Answering Flow */
        <div>
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
              <span>Question {currentIndex + 1} of {normalizedQuestions.length}</span>
              <span>{answeredCount} of {normalizedQuestions.length} Answered</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                animate={{ width: `${((currentIndex + 1) / normalizedQuestions.length) * 100}%` }}
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
              />
            </div>
          </div>

          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg sm:text-2xl font-semibold text-white leading-snug">{currentQuestion.question}</h3>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = currentAnswer === index;

                    return (
                      <button
                        type="button"
                        key={index}
                        onClick={() => handleSelectOption(index)}
                        className={`w-full rounded-2xl border-2 p-3.5 sm:p-4 text-left transition touch-manipulation cursor-pointer ${
                          isSelected
                            ? "border-violet-500 bg-violet-500/20 text-white shadow-lg shadow-violet-500/10"
                            : "border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20 hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              isSelected ? "bg-violet-500 text-white" : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-xs sm:text-sm font-medium leading-relaxed">{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Quiz Navigation Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handlePrevQuestion}
                    disabled={currentIndex === 0}
                    className="rounded-full bg-slate-900 px-4 sm:px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 transition cursor-pointer"
                  >
                    ← Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {currentIndex < normalizedQuestions.length - 1 && (
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        disabled={!isQuestionAnswered}
                        className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-5 sm:px-6 py-2.5 text-xs font-semibold text-slate-950 hover:opacity-95 disabled:opacity-40 transition cursor-pointer"
                      >
                        Next Question →
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleSubmitQuiz}
                      disabled={submitting}
                      className={`rounded-full px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-slate-950 shadow-xl hover:opacity-95 disabled:opacity-40 transition cursor-pointer ${
                        currentIndex === normalizedQuestions.length - 1
                          ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
                          : "bg-slate-800 text-slate-300 border border-white/10 hover:text-white"
                      }`}
                    >
                      {submitting ? "Submitting..." : "Submit Quiz & Get Score"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </section>
  );
}
