import { useState } from 'react';
import { calculateOneWayDamage, calculateFightingDamage } from '../services/DamageCalculationService';

/**
 * Custom hook for managing damage calculations.
 * @param {string} type - 'shooting' or 'fighting'
 * @returns {Object} Calculation state and methods
 */
export const useDamageCalculation = (type) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculate = ({ shooterStats, targetStats, attStats, defStats }) => {
    setLoading(true);
    setError('');
    setResult(null);

    const iterations = 50000;

    if (type === 'shooting') {
      let totalDamage = 0;
      const dmgDist = {};

      for (let i = 0; i < iterations; i++) {
        const damage = calculateOneWayDamage(
          shooterStats.attacks,
          shooterStats.bs,
          shooterStats.normalDmg,
          shooterStats.critDmg,
          shooterStats.lethal,
          shooterStats.balanced,
          shooterStats.ceaseless,
          shooterStats.relentless,
          shooterStats.rending,
          shooterStats.punishing,
          shooterStats.severe,
          shooterStats.shock,
          shooterStats.hot,
          shooterStats.piercing,
          shooterStats.piercingCrits,
          shooterStats.devastating,
          shooterStats.mw,
          targetStats.df,
          targetStats.sv
        );
        totalDamage += damage;
        dmgDist[damage] = (dmgDist[damage] || 0) + 1;
      }

      const avgDamage = totalDamage / iterations;
      const avgRemainingWounds = Math.max(targetStats.wounds - avgDamage, 0);
      let killCount = 0;
      for (const dmg in dmgDist) {
        if (parseInt(dmg) >= targetStats.wounds) {
          killCount += dmgDist[dmg];
        }
      }
      const probKill = (killCount / iterations) * 100;

      setResult({
        avgDamage,
        avgRemainingWounds,
        probKill,
        dmgDist,
      });
    } else if (type === 'fighting') {
      const { avgDamageToDef, avgDamageToAtt, dmgDistDef, dmgDistAtt } = calculateFightingDamage(attStats, defStats, iterations);

      const avgRemainingWoundsDef = Math.max(defStats.wounds - avgDamageToDef, 0);
      const avgRemainingWoundsAtt = Math.max(attStats.wounds - avgDamageToAtt, 0);

      let killCountDef = 0;
      for (const dmg in dmgDistDef) {
        if (parseInt(dmg) >= defStats.wounds) {
          killCountDef += dmgDistDef[dmg];
        }
      }
      const probKillDef = (killCountDef / iterations) * 100;

      let killCountAtt = 0;
      for (const dmg in dmgDistAtt) {
        if (parseInt(dmg) >= attStats.wounds) {
          killCountAtt += dmgDistAtt[dmg];
        }
      }
      const probKillAtt = (killCountAtt / iterations) * 100;

      setResult({
        avgDamageToDef,
        avgDamageToAtt,
        avgRemainingWoundsDef,
        avgRemainingWoundsAtt,
        probKillDef,
        probKillAtt,
        dmgDistDef,
        dmgDistAtt,
      });
    }

    setLoading(false);
  };

  return { result, loading, error, calculate };
};