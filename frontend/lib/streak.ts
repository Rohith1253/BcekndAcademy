export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
}

export function calculateStreak(lastActiveDate: string): { currentStreak: number; isactive: boolean } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDate = new Date(lastActiveDate);
  lastDate.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let currentStreak = 1;
  let isActive = true;

  if (diffDays === 0) {
    currentStreak = 1;
    isActive = true;
  } else if (diffDays === 1) {
    currentStreak = 1;
    isActive = true;
  } else {
    currentStreak = 0;
    isActive = false;
  }

  return { currentStreak, isactive: isActive };
}

export function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start your first day!";
  if (streak === 1) return "Great start! Keep it going.";
  if (streak === 3) return "You're on fire! 🔥";
  if (streak === 7) return "A full week! Amazing!";
  if (streak === 14) return "Two weeks! You're unstoppable!";
  if (streak === 30) return "30 days! You're a legend!";
  if (streak >= 100) return "100+ days! Absolutely incredible!";
  return `${streak} day streak! Keep learning!`;
}

export function getStreakEmoji(streak: number): string {
  if (streak === 0) return "🌱";
  if (streak < 3) return "🌿";
  if (streak < 7) return "🌳";
  if (streak < 14) return "🔥";
  if (streak < 30) return "🌟";
  return "👑";
}
