/**
 * Fisher-Yates shuffle — returns a new shuffled copy of the array.
 */
export function shuffleArray(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Pick `count` random items from `array` without replacement.
 */
export function pickRandom(array, count) {
  return shuffleArray(array).slice(0, count);
}

/**
 * Calculate the position delta for a single animation tick.
 * Higher condition → higher average speed, but with randomness.
 *
 * @param {number} condition - Horse condition (1–100)
 * @param {number} distance  - Round distance in meters (affects base speed scaling)
 * @returns {number} Position increment (0–~2.5 percentage points)
 */
export function calculateStep(condition, distance) {
  const distanceFactor = 1200 / distance; // shorter races → bigger steps → faster finish
  const base = 0.3 * distanceFactor;
  const conditionBonus = (condition / 100) * 0.6 * distanceFactor;
  const randomJitter = Math.random() * 0.8 * distanceFactor;
  return base + conditionBonus + randomJitter;
}
