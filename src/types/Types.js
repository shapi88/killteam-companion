/**
 * @typedef {Object} ShooterStats
 * @property {number} attacks - Number of attacks
 * @property {number} bs - Ballistic Skill
 * @property {number} normalDmg - Normal damage
 * @property {number} critDmg - Critical damage
 * @property {number} lethal - Lethal hit threshold
 * @property {boolean} balanced - Balanced rule
 * @property {boolean} ceaseless - Ceaseless rule
 * @property {boolean} relentless - Relentless rule
 * @property {boolean} rending - Rending rule
 * @property {boolean} punishing - Punishing rule
 * @property {boolean} severe - Severe rule
 * @property {boolean} shock - Shock rule
 * @property {boolean} hot - Hot rule
 * @property {number} piercing - Piercing value
 * @property {number} piercingCrits - Piercing on critical hits
 * @property {number} devastating - Devastating value
 * @property {number} mw - Mortal wounds
 */

/**
 * @typedef {Object} TargetStats
 * @property {number} wounds - Wounds
 * @property {number} df - Defense
 * @property {number} sv - Save
 */

/**
 * @typedef {Object} MeleeStats
 * @property {number} wounds - Wounds
 * @property {number} attacks - Number of attacks
 * @property {number} hit - Weapon Skill
 * @property {number} normalDmg - Normal damage
 * @property {number} critDmg - Critical damage
 * @property {number} lethal - Lethal hit threshold
 * @property {boolean} balanced - Balanced rule
 * @property {boolean} ceaseless - Ceaseless rule
 * @property {boolean} relentless - Relentless rule
 * @property {boolean} rending - Rending rule
 * @property {boolean} brutal - Brutal rule
 * @property {boolean} punishing - Punishing rule
 * @property {boolean} severe - Severe rule
 * @property {boolean} shock - Shock rule
 * @property {number} piercing - Piercing value
 * @property {number} piercingCrits - Piercing on critical hits
 * @property {number} devastating - Devastating value
 */

/**
 * @typedef {Object} ShootingResult
 * @property {number} avgDamage - Average damage to target
 * @property {number} avgRemainingWounds - Average remaining wounds
 * @property {number} probKill - Probability of kill (%)
 * @property {Object.<string, number>} dmgDist - Damage distribution
 */

/**
 * @typedef {Object} FightingResult
 * @property {number} avgDamageToDef - Average damage to defender
 * @property {number} avgDamageToAtt - Average damage to attacker
 * @property {number} avgRemainingWoundsDef - Average remaining wounds for defender
 * @property {number} avgRemainingWoundsAtt - Average remaining wounds for attacker
 * @property {number} probKillDef - Probability of killing defender (%)
 * @property {number} probKillAtt - Probability of killing attacker (%)
 * @property {Object.<string, number>} dmgDistDef - Damage distribution to defender
 * @property {Object.<string, number>} dmgDistAtt - Damage distribution to attacker
 */