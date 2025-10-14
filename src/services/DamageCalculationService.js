/**
 * Calculates damage for a single shooting attack.
 * @param {number} attacks
 * @param {number} bs
 * @param {number} normalDmg
 * @param {number} critDmg
 * @param {number} lethal
 * @param {boolean} balanced
 * @param {boolean} ceaseless
 * @param {boolean} relentless
 * @param {boolean} rending
 * @param {boolean} punishing
 * @param {boolean} severe
 * @param {boolean} shock
 * @param {boolean} hot
 * @param {number} piercing
 * @param {number} piercingCrits
 * @param {number} devastating
 * @param {number} mw
 * @param {number} df
 * @param {number} sv
 * @returns {number} Calculated damage
 */
export const calculateOneWayDamage = (
  attacks, bs, normalDmg, critDmg, lethal, balanced, ceaseless, relentless, rending, punishing, severe, shock, hot, piercing, piercingCrits, devastating, mw,
  df, sv
) => {
  let attDice = Array.from({ length: attacks }, () => Math.floor(Math.random() * 6) + 1);

  // Apply rerolls
  if (hot && attDice.some(d => d === 1)) {
    attDice = Array.from({ length: attacks }, () => Math.floor(Math.random() * 6) + 1);
  }
  if (ceaseless) {
    attDice = attDice.map(d => d === 1 ? Math.floor(Math.random() * 6) + 1 : d);
  }
  if (relentless) {
    attDice = attDice.map(d => d < bs ? Math.floor(Math.random() * 6) + 1 : d);
  }
  if (balanced && attDice.some(d => d < bs)) {
    const failIndex = attDice.findIndex(d => d < bs);
    attDice[failIndex] = Math.floor(Math.random() * 6) + 1;
  }

  // Calculate successes
  let crits = attDice.filter(d => d >= lethal).length;
  let normals = attDice.filter(d => d >= bs && d < lethal).length;

  // Apply special rules
  if (punishing && crits > 0 && attDice.some(d => d < bs)) {
    normals++;
  }
  if (severe && crits === 0 && normals > 0) {
    normals--;
    crits++;
  }
  if (rending && crits > 0 && normals > 0) {
    normals--;
    crits++;
  }

  // Calculate effective defense
  let effectiveDf = df - piercing - (piercingCrits * crits);
  if (effectiveDf < 0) effectiveDf = 0;

  let defDice = Array.from({ length: effectiveDf }, () => Math.floor(Math.random() * 6) + 1);

  // Defender successes
  let defCrits = defDice.filter(d => d >= 6).length;
  let defNormals = defDice.filter(d => d >= sv && d < 6).length;

  // Apply shock
  if (shock && crits > 0) {
    defCrits = 0;
  }

  // Calculate saved hits
  let saved = defCrits + defNormals;

  // Calculate damage
  let damage = (crits * critDmg) + (normals * normalDmg) - (saved * normalDmg);
  if (damage < 0) damage = 0;
  damage += mw;
  damage += devastating * crits;

  return damage;
};

/**
 * Calculates damage for a fighting phase based on Kill Team 2025 rules.
 * @param {MeleeStats} attStats - Attacker's stats
 * @param {MeleeStats} defStats - Defender's stats
 * @param {number} iterations - Number of Monte Carlo iterations
 * @returns {Object} Calculation results
 */
export const calculateFightingDamage = (attStats, defStats, iterations) => {
  let totalDamageToDef = 0;
  let totalDamageToAtt = 0;
  const dmgDistDef = {};
  const dmgDistAtt = {};

  for (let i = 0; i < iterations; i++) {
    // Attacker rolls (Strike phase)
    let attDice = Array.from({ length: attStats.attacks }, () => Math.floor(Math.random() * 6) + 1);
    if (attStats.ceaseless) {
      attDice = attDice.map(d => d === 1 ? Math.floor(Math.random() * 6) + 1 : d);
    }
    if (attStats.relentless) {
      attDice = attDice.map(d => d < attStats.hit ? Math.floor(Math.random() * 6) + 1 : d);
    }
    if (attStats.balanced && attDice.some(d => d < attStats.hit)) {
      const failIndex = attDice.findIndex(d => d < attStats.hit);
      attDice[failIndex] = Math.floor(Math.random() * 6) + 1;
    }
    let attCrits = attDice.filter(d => d >= attStats.lethal).length;
    let attNormals = attDice.filter(d => d >= attStats.hit && d < attStats.lethal).length;

    // Apply attacker special rules (before defense)
    if (attStats.punishing && attCrits > 0 && attDice.some(d => d < attStats.hit)) {
      attNormals++;
    }
    if (attStats.severe && attCrits === 0 && attNormals > 0) {
      attNormals--;
      attCrits++;
    }
    if (attStats.rending && attCrits > 0 && attNormals > 0) {
      attNormals--;
      attCrits++;
    }

    // Defender rolls parrys (based on Defence, default to attacks if df is 0)
    let defParryCount = defStats.df || defStats.attacks; // Default to attacks if df not provided
    let defParryDice = Array.from({ length: defParryCount }, () => Math.floor(Math.random() * 6) + 1);
    let defParryCrits = defParryDice.filter(d => d >= 6).length;
    let defParryNormals = defParryDice.filter(d => d >= defStats.sv && d < 6).length;
    let totalParrys = defParryCrits + defParryNormals;

    // Calculate damage to defender
    let damageToDef = (attCrits * attStats.critDmg) + (attNormals * attStats.normalDmg);
    damageToDef += attStats.devastating * attCrits;

    // Apply Brutal: only normal parrys block normal damage, critical damage is unaffected
    if (attStats.brutal) {
      damageToDef -= Math.min(totalParrys, attNormals * attStats.normalDmg); // Only normals blocked
    } else {
      damageToDef -= Math.min(totalParrys, (attCrits * attStats.critDmg) + (attNormals * attStats.normalDmg)); // All blocked
    }

    // Ensure non-negative damage
    damageToDef = Math.max(damageToDef, 0);

    // Defender retaliation (unused parrys convert to strikes)
    let unusedParrys = Math.max(0, defParryCount - totalParrys);
    let defStrikeDice = Array.from({ length: unusedParrys }, () => Math.floor(Math.random() * 6) + 1);
    if (defStats.ceaseless) {
      defStrikeDice = defStrikeDice.map(d => d === 1 ? Math.floor(Math.random() * 6) + 1 : d);
    }
    if (defStats.relentless) {
      defStrikeDice = defStrikeDice.map(d => d < defStats.hit ? Math.floor(Math.random() * 6) + 1 : d);
    }
    if (defStats.balanced && defStrikeDice.some(d => d < defStats.hit)) {
      const failIndex = defStrikeDice.findIndex(d => d < defStats.hit);
      defStrikeDice[failIndex] = Math.floor(Math.random() * 6) + 1;
    }
    let defCrits = defStrikeDice.filter(d => d >= defStats.lethal).length;
    let defNormals = defStrikeDice.filter(d => d >= defStats.hit && d < defStats.lethal).length;

    // Apply defender special rules
    if (defStats.punishing && defCrits > 0 && defStrikeDice.some(d => d < defStats.hit)) {
      defNormals++;
    }
    if (defStats.severe && defCrits === 0 && defNormals > 0) {
      defNormals--;
      defCrits++;
    }
    if (defStats.rending && defCrits > 0 && defNormals > 0) {
      defNormals--;
      defCrits++;
    }

    // Calculate damage to attacker
    let damageToAtt = (defCrits * defStats.critDmg) + (defNormals * defStats.normalDmg);
    damageToAtt += defStats.devastating * defCrits;

    // Apply Brutal (defender's perspective)
    if (defStats.brutal) {
      damageToAtt -= Math.min(totalParrys, attCrits * attStats.critDmg); // Only crits blocked
    } else {
      damageToAtt -= Math.min(totalParrys, (attCrits * attStats.critDmg) + (attNormals * attStats.normalDmg)); // All blocked
    }

    // Apply shock
    if (attStats.shock && attCrits > 0) {
      damageToAtt += defCrits; // Add defender's crits as extra damage
    }
    if (defStats.shock && defCrits > 0) {
      damageToDef += attCrits; // Add attacker's crits as extra damage
    }

    // Ensure non-negative damage
    damageToAtt = Math.max(damageToAtt, 0);

    totalDamageToDef += damageToDef;
    totalDamageToAtt += damageToAtt;
    dmgDistDef[damageToDef] = (dmgDistDef[damageToDef] || 0) + 1;
    dmgDistAtt[damageToAtt] = (dmgDistAtt[damageToAtt] || 0) + 1;
  }

  return {
    avgDamageToDef: totalDamageToDef / iterations,
    avgDamageToAtt: totalDamageToAtt / iterations,
    dmgDistDef,
    dmgDistAtt
  };
};