export const BASE_SCORES = { Easy: 100, Medium: 150, Hard: 200 };

export function calculateScore({ difficulty, correct, cluesDiscovered, hintsUsed }) {
  if (!correct) return 0;
  const base = BASE_SCORES[difficulty] ?? 0;
  return Math.max(0, base + cluesDiscovered * 5 - hintsUsed * 10);
}