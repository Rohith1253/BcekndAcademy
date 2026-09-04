import AchievementCard from "@/components/dashboard/AchievementCard";
import ContinueLearning from "@/components/dashboard/ContinueLearning";
import DailyChallenge from "@/components/dashboard/DailyChallenge";
import StatsCards from "@/components/dashboard/StatsCards";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import ContinuePlayingGames from "@/components/dashboard/ContinuePlayingGames";
import ContinueCoding from "@/components/dashboard/ContinueCoding";
import CodingLabRecentWidget from "@/components/dashboard/CodingLabRecentWidget";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-24 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <WelcomeBanner />
        <StatsCards />

        {/* Continue Educational Games Section */}
        <ContinuePlayingGames />

        {/* Hands-On Coding Practice Section */}
        <ContinueCoding />

        {/* Interactive AI Coding Lab Section */}
        <CodingLabRecentWidget />

        <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
          <ContinueLearning />
          <DailyChallenge />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <AchievementCard />

          <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-7 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Recent Activity</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Today’s progress</h3>
              </div>
              <span className="rounded-full bg-slate-900/90 px-4 py-2 text-sm text-slate-300">Live</span>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 px-5 py-5 shadow-inner shadow-white/5">
                <p className="text-sm text-slate-400">Completed</p>
                <p className="mt-2 text-lg font-semibold text-white">HTTP Lesson</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 px-5 py-5 shadow-inner shadow-white/5">
                <p className="text-sm text-slate-400">Reward</p>
                <p className="mt-2 text-lg font-semibold text-white">Earned 100 XP</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 px-5 py-5 shadow-inner shadow-white/5">
                <p className="text-sm text-slate-400">Unlocked</p>
                <p className="mt-2 text-lg font-semibold text-white">Node.js</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
