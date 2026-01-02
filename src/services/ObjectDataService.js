// ObjectDataService: loads public/object-example.json and organizes it by killteam

/**
 * @typedef {import('../types/Types').Faction} Faction
 * @typedef {import('../types/Types').Killteam} Killteam
 * @typedef {import('../types/Types').OpType} OpType
 * @typedef {import('../types/Types').Ability} Ability
 * @typedef {import('../types/Types').Equipment} Equipment
 * @typedef {import('../types/Types').OptionRule} OptionRule
 * @typedef {import('../types/Types').Ploy} Ploy
 * @typedef {import('../types/Types').Weapon} Weapon
 * @typedef {import('../types/Types').WeaponProfile} WeaponProfile
 * @typedef {import('../types/Types').WeaponRule} WeaponRule
 * @typedef {import('../types/Types').OrganizedKillteam} OrganizedKillteam
 * @typedef {import('../types/Types').OrganizedOpType} OrganizedOpType
 * @typedef {import('../types/Types').OrganizedWeapon} OrganizedWeapon
 */

let _rawCache = null;
let _organizedById = null;

/**
 * Parse WR string (weapon rules codes) into an array of codes.
 * Accepts forms like "ACC_, RND" or "ACC_" or "".
 * @param {string} wr
 * @returns {string[]}
 */
const parseWR = (wr) => {
  if (!wr || typeof wr !== 'string') return [];
  return wr
    .split(/[;,\s]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
};

/**
 * Load the JSON from public/object-example.json
 * Works in browser using fetch.
 * @returns {Promise<any>}
 */
export async function loadObjectData() {
  if (_rawCache) return _rawCache;
  const base = (typeof process !== 'undefined' && process.env && process.env.PUBLIC_URL) ? process.env.PUBLIC_URL : '';
  const url = `${base}/seed-data.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load object data: ${res.status}`);
  _rawCache = await res.json();
  return _rawCache;
}

/**
 * Build indices for quick lookup.
 */
function buildIndices(raw) {
  const idx = {
    factionsById: new Map(),
    killteamsById: new Map(),
    optypesByKillteam: new Map(),
    abilitiesByOpType: new Map(),
    optionsByOpType: new Map(),
    equipmentsByKillteam: new Map(),
    ploysByKillteam: new Map(),
    weaponsByOpType: new Map(),
    profilesByWeapon: new Map(),
    weaponRulesByCode: new Map(),
  };

  (raw.factions || []).forEach(/** @param {Faction} f */(f) => idx.factionsById.set(f.factionId, f));
  (raw.killteams || []).forEach(/** @param {Killteam} k */(k) => idx.killteamsById.set(k.killteamId, k));

  (raw.optypes || []).forEach(/** @param {OpType} o */(o) => {
    const arr = idx.optypesByKillteam.get(o.killteamId) || [];
    arr.push(o);
    idx.optypesByKillteam.set(o.killteamId, arr);
  });

  (raw.abilities || []).forEach(/** @param {Ability} a */(a) => {
    const arr = idx.abilitiesByOpType.get(a.opTypeId) || [];
    arr.push(a);
    idx.abilitiesByOpType.set(a.opTypeId, arr);
  });

  (raw.options || []).forEach(/** @param {OptionRule} o */(o) => {
    const arr = idx.optionsByOpType.get(o.opTypeId) || [];
    arr.push(o);
    idx.optionsByOpType.set(o.opTypeId, arr);
  });

  (raw.equipments || []).forEach(/** @param {Equipment} e */(e) => {
    const arr = idx.equipmentsByKillteam.get(e.killteamId) || [];
    arr.push(e);
    idx.equipmentsByKillteam.set(e.killteamId, arr);
  });

  (raw.ploys || []).forEach(/** @param {Ploy} p */(p) => {
    const arr = idx.ploysByKillteam.get(p.killteamId) || [];
    arr.push(p);
    idx.ploysByKillteam.set(p.killteamId, arr);
  });

  (raw.weapons || []).forEach(/** @param {Weapon} w */(w) => {
    const arr = idx.weaponsByOpType.get(w.opTypeId) || [];
    arr.push(w);
    idx.weaponsByOpType.set(w.opTypeId, arr);
  });

  (raw.weaponprofiles || []).forEach(/** @param {WeaponProfile} wp */(wp) => {
    const arr = idx.profilesByWeapon.get(wp.wepId) || [];
    arr.push(wp);
    idx.profilesByWeapon.set(wp.wepId, arr);
  });

  (raw.weaponrules || []).forEach(/** @param {WeaponRule} wr */(wr) => {
    idx.weaponRulesByCode.set(wr.code, wr);
  });

  return idx;
}

/**
 * Organize the raw data by killteam, nesting faction, optypes, abilities, options, weapons, profiles, rules, equipments and ploys.
 * @param {any} raw
 * @returns {Map<string, OrganizedKillteam>}
 */
function organizeByKillteam(raw) {
  const idx = buildIndices(raw);
  const out = new Map();

  idx.killteamsById.forEach((killteam) => {
    /** @type {OrganizedOpType[]} */
    const opTypes = (idx.optypesByKillteam.get(killteam.killteamId) || [])
      .sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0))
      .map((opType) => {
        const abilities = (idx.abilitiesByOpType.get(opType.opTypeId) || []).sort((a, b) => (a.AP ?? 0) - (b.AP ?? 0));
        const options = (idx.optionsByOpType.get(opType.opTypeId) || []).sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0));
        /** @type {OrganizedWeapon[]} */
        const weapons = (idx.weaponsByOpType.get(opType.opTypeId) || [])
          .sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0))
          .map((weapon) => {
            const profiles = (idx.profilesByWeapon.get(weapon.wepId) || []).sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0));
            // Gather rules by parsing WR codes from profiles
            const ruleCodes = Array.from(new Set(profiles.flatMap((p) => parseWR(p.WR))));
            const rules = ruleCodes.map((code) => idx.weaponRulesByCode.get(code)).filter(Boolean);
            return { weapon, profiles, rules };
          });
        return { opType, abilities, options, weapons };
      });

    /** @type {OrganizedKillteam} */
    const organized = {
      killteam,
      faction: idx.factionsById.get(killteam.factionId),
      optypes: opTypes,
      ploys: (idx.ploysByKillteam.get(killteam.killteamId) || []).sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0)),
      equipments: (idx.equipmentsByKillteam.get(killteam.killteamId) || []).sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0)),
    };

    out.set(killteam.killteamId, organized);
  });

  return out;
}

/**
 * Ensure organized cache exists.
 * @returns {Promise<Map<string, OrganizedKillteam>>}
 */
async function ensureOrganized() {
  if (_organizedById) return _organizedById;
  const raw = await loadObjectData();
  _organizedById = organizeByKillteam(raw);
  return _organizedById;
}

/**
 * Get a list of killteams for the top-page.
 * @returns {Promise<OrganizedKillteam[]>}
 */
export async function getKillteams() {
  const map = await ensureOrganized();
  return Array.from(map.values()).sort((a, b) => (a.killteam.seq ?? 0) - (b.killteam.seq ?? 0));
}

/**
 * Get details for a single killteamId, with nested structures.
 * @param {string} killteamId
 * @returns {Promise<OrganizedKillteam|undefined>}
 */
export async function getKillteamDetails(killteamId) {
  const map = await ensureOrganized();
  return map.get(killteamId);
}

/**
 * Reset caches (useful for tests or hot reloads).
 */
export function _resetObjectDataServiceCache() {
  _rawCache = null;
  _organizedById = null;
}
