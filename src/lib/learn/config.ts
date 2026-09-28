/**
 * Learning progression lock configuration.
 *
 * Set LEARNING_LOCKS_ENABLED to false for DEVELOPMENT MODE (all implemented levels directly accessible).
 * Set LEARNING_LOCKS_ENABLED to true for PRODUCTION MODE (requires completing previous level to unlock next).
 */
export const LEARNING_LOCKS_ENABLED = false;

/**
 * Returns true if level access is allowed based on completion state and config.
 */
export function isLevelAccessAllowed(isPrerequisiteCompleted: boolean): boolean {
  if (!LEARNING_LOCKS_ENABLED) return true;
  return isPrerequisiteCompleted;
}
