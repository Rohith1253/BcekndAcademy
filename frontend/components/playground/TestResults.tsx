"use client";

import { motion } from "framer-motion";

interface TestCase {
  name: string;
  passed: boolean;
  expectedOutput: string;
  actualOutput: string;
}

interface TestResultsProps {
  results: TestCase[];
  testsPassed: number;
  totalTests: number;
  xpReward: number;
}

export default function TestResults({ results, testsPassed, totalTests, xpReward }: TestResultsProps) {
  const allPassed = testsPassed === totalTests;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Summary */}
      <motion.div
        className={`rounded-[1.5rem] p-5 border-2 ${
          allPassed
            ? "border-emerald-500/50 bg-emerald-500/10"
            : "border-amber-500/50 bg-amber-500/10"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-lg font-bold ${allPassed ? "text-emerald-300" : "text-amber-300"}`}>
              {testsPassed} / {totalTests} Tests Passed
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {allPassed ? "🎉 All tests passed!" : "💡 Keep trying!"}
            </p>
          </div>
          {allPassed && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-4xl"
            >
              ✓
            </motion.div>
          )}
        </div>

        {allPassed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-sm font-semibold text-emerald-300"
          >
            +{xpReward} XP Earned! 🌟
          </motion.p>
        )}
      </motion.div>

      {/* Test cases */}
      <div className="space-y-2">
        {results.map((test, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-[1.25rem] border-2 p-4 transition ${
              test.passed
                ? "border-emerald-500/30 bg-emerald-500/5"
                : "border-rose-500/30 bg-rose-500/5"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className={`mt-1 text-xl ${test.passed ? "text-emerald-400" : "text-rose-400"}`}>
                {test.passed ? "✓" : "✗"}
              </span>
              <div className="flex-1">
                <p className={`font-medium ${test.passed ? "text-emerald-300" : "text-rose-300"}`}>
                  {test.name}
                </p>
                {!test.passed && (
                  <div className="mt-2 space-y-1 text-xs text-slate-400">
                    <p>Expected: {test.expectedOutput}</p>
                    <p>Got: {test.actualOutput}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
