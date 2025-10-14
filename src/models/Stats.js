/**
 * Default stats for shooter.
 * @type {ShooterStats}
 */
export const SHOOTER_DEFAULTS = {
  attacks: 4,
  bs: 3,
  normalDmg: 3,
  critDmg: 4,
  lethal: 6,
  balanced: false,
  ceaseless: false,
  relentless: false,
  rending: false,
  punishing: false,
  severe: false,
  shock: false,
  hot: false,
  piercing: 0,
  piercingCrits: 0,
  devastating: 0,
  mw: 0,
};

/**
 * Default stats for target.
 * @type {TargetStats}
 */
export const TARGET_DEFAULTS = {
  wounds: 7,
  df: 3,
  sv: 3,
};

/**
 * Default stats for melee (attacker or defender).
 * @type {MeleeStats}
 */
export const MELEE_DEFAULTS = {
  wounds: 7,
  attacks: 4,
  hit: 3,
  normalDmg: 3,
  critDmg: 4,
  lethal: 6,
  balanced: false,
  ceaseless: false,
  relentless: false,
  rending: false,
  brutal: false,
  punishing: false,
  severe: false,
  shock: false,
  piercing: 0,
  piercingCrits: 0,
  devastating: 0,
};