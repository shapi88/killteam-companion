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

/**
 * Domain data types loaded from object-example.json
 */

/**
 * @typedef {Object} Faction
 * @property {string} factionId
 * @property {string} factionName
 * @property {string} description
 * @property {number} seq
 */

/**
 * @typedef {Object} Killteam
 * @property {string} killteamId
 * @property {string} factionId
 * @property {number} seq
 * @property {string} killteamName
 * @property {string} description
 * @property {string} composition
 * @property {string|null} archetypes
 * @property {string|null} userId
 * @property {boolean} isPublished
 * @property {string|null} defaultRosterId
 */

/**
 * @typedef {Object} OpType
 * @property {string} opTypeId
 * @property {string} killteamId
 * @property {number} seq
 * @property {string} opTypeName
 * @property {string} MOVE
 * @property {number} APL
 * @property {string} SAVE
 * @property {number} WOUNDS
 * @property {string} keywords
 * @property {number} basesize
 * @property {string} nameType
 */

/**
 * @typedef {Object} Ability
 * @property {string} abilityId
 * @property {string} opTypeId
 * @property {string} abilityName
 * @property {string} description
 * @property {number} AP
 */

/**
 * @typedef {Object} Equipment
 * @property {string} eqId
 * @property {string} killteamId
 * @property {number} seq
 * @property {string} eqName
 * @property {string} description
 * @property {string} effects
 */

/**
 * @typedef {Object} OptionRule
 * @property {string} optionId
 * @property {string} opTypeId
 * @property {number} seq
 * @property {string} optionName
 * @property {string} description
 * @property {string} effects
 */

/**
 * @typedef {Object} Ploy
 * @property {string} ployId
 * @property {string} killteamId
 * @property {number} seq
 * @property {"S"|"F"|string} ployType
 * @property {string} ployName
 * @property {string} description
 * @property {string} effects
 */

/**
 * @typedef {Object} Weapon
 * @property {string} wepId
 * @property {string} opTypeId
 * @property {number} seq
 * @property {string} wepName
 * @property {"R"|"M"|string} wepType
 * @property {boolean} isDefault
 */

/**
 * @typedef {Object} WeaponProfile
 * @property {string} wepprofileId
 * @property {string} wepId
 * @property {number} seq
 * @property {string} profileName
 * @property {string} ATK
 * @property {string} HIT
 * @property {string} DMG
 * @property {string} WR
 */

/**
 * @typedef {Object} WeaponRule
 * @property {string} code
 * @property {string} ruleName
 * @property {string} description
 */

/**
 * Organized structures returned by the data service
 */

/**
 * @typedef {Object} OrganizedWeapon
 * @property {Weapon} weapon
 * @property {WeaponProfile[]} profiles
 * @property {WeaponRule[]} rules
 */

/**
 * @typedef {Object} OrganizedOpType
 * @property {OpType} opType
 * @property {Ability[]} abilities
 * @property {OptionRule[]} options
 * @property {OrganizedWeapon[]} weapons
 */

/**
 * @typedef {Object} OrganizedKillteam
 * @property {Killteam} killteam
 * @property {Faction|undefined} faction
 * @property {OrganizedOpType[]} optypes
 * @property {Ploy[]} ploys
 * @property {Equipment[]} equipments
 */