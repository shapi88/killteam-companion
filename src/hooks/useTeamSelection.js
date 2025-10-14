import { useState, useEffect, useCallback } from 'react';
import { MELEE_DEFAULTS } from '../models/Stats';

/**
 * Custom hook for managing team, operator, and weapon selection.
 * @param {Object} teamData - Team data from JSON
 * @param {string|null} weaponType - 'ranged' or 'melee' for weapon selection, null for target
 * @param {Object} defaultStats - Default stats for the entity
 * @returns {Object} Selection state and methods
 */
export const useTeamSelection = (teamData, weaponType = null, defaultStats) => {
  const [team, setTeam] = useState('');
  const [operator, setOperator] = useState('');
  const [weapon, setWeapon] = useState('');
  const [stats, setStats] = useState(defaultStats);
  const [error, setError] = useState('');

  const teams = Object.keys(teamData);
  const operators = team ? Object.keys(teamData[team]?.operators || {}) : [];
  const weapons = team && operator && weaponType ? Object.keys(teamData[team].operators[operator]?.[weaponType] || {}) : [];

  const preFill = useCallback(() => {
    if (team && operator) {
      const opData = teamData[team].operators[operator];
      if (weaponType) {
        const weaponData = opData[weaponType] || {};
        if (Object.keys(weaponData).length === 0 && weaponType === 'melee') {
          setStats({ ...defaultStats, attacks: 0, normalDmg: 0, critDmg: 0 });
          setError('The selected operator has no melee weapon. Please select another operator or weapon.');
          return;
        }
        const selectedWeaponData = weapon && weaponData[weapon] ? weaponData[weapon] : Object.values(weaponData)[0] || {};
        setStats({
          ...defaultStats,
          wounds: opData.wounds || defaultStats.wounds,
          attacks: selectedWeaponData.attacks || defaultStats.attacks,
          hit: selectedWeaponData.hit || defaultStats.hit || defaultStats.bs,
          normalDmg: selectedWeaponData.normalDmg || defaultStats.normalDmg,
          critDmg: selectedWeaponData.critDmg || defaultStats.critDmg,
          lethal: selectedWeaponData.lethal || defaultStats.lethal,
          balanced: selectedWeaponData.balanced || defaultStats.balanced,
          ceaseless: selectedWeaponData.ceaseless || defaultStats.ceaseless,
          relentless: selectedWeaponData.relentless || defaultStats.relentless,
          rending: selectedWeaponData.rending || defaultStats.rending,
          brutal: selectedWeaponData.brutal || defaultStats.brutal || false,
          punishing: selectedWeaponData.punishing || defaultStats.punishing,
          severe: selectedWeaponData.severe || defaultStats.severe,
          shock: selectedWeaponData.shock || defaultStats.shock,
          hot: selectedWeaponData.hot || defaultStats.hot || false,
          piercing: selectedWeaponData.piercing || defaultStats.piercing,
          piercingCrits: selectedWeaponData.piercingCrits || defaultStats.piercingCrits,
          devastating: selectedWeaponData.devastating || defaultStats.devastating,
          mw: selectedWeaponData.mw || defaultStats.mw || 0,
        });
        setError('');
      } else {
        setStats({
          ...defaultStats,
          wounds: opData.wounds || defaultStats.wounds,
          df: opData.df || defaultStats.df,
          sv: opData.save || defaultStats.sv,
        });
        setError('');
      }
    }
  }, [team, operator, weapon, teamData, weaponType, defaultStats]);

  useEffect(() => {
    preFill();
  }, [preFill]);

  const updateStat = (key, value) => {
    setStats((prev) => ({ ...prev, [key]: value }));
  };

  return {
    team,
    operator,
    weapon,
    stats,
    setTeam,
    setOperator,
    setWeapon,
    updateStat,
    teams,
    operators,
    weapons,
    error,
  };
};