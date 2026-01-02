import { create } from 'zustand';
import { BOARD, DEFAULTS } from '../constants/sandbox';
import { createBase, createTerrain, createObjective } from '../models/Sandbox';

export const useSandboxStore = create((set, get) => ({
  // Core state
  bases: [],
  terrains: [],
  objectives: [],

  // Config
  deploymentType: DEFAULTS.deploymentType,
  snapToGrid: DEFAULTS.snapToGrid,
  movement: DEFAULTS.movement,
  chargeRange: DEFAULTS.chargeRange,
  shootingRange: DEFAULTS.shootingRange,
  showLOS: false,

  // Actions
  setDeploymentType: (deploymentType) => set({ deploymentType }),
  setSnapToGrid: (snapToGrid) => set({ snapToGrid }),
  setMovement: (movement) => set({ movement }),
  setChargeRange: (chargeRange) => set({ chargeRange }),
  setShootingRange: (shootingRange) => set({ shootingRange }),
  setShowLOS: (showLOS) => set({ showLOS }),

  addBase: (player, { x, y, radius, elevation }) => set(state => ({
    bases: [...state.bases, { ...createBase(player, { x, y, radius, elevation }), showVisibility: false, showShooting: false, showMovement: false, showCharge: false }]
  })),

  addTerrain: ({ x, y, w, h, elevation, type }) => set(state => ({
    terrains: [...state.terrains, createTerrain({ x, y, w, h, elevation, type })]
  })),

  addObjective: ({ x, y, type }) => set(state => ({
    objectives: [...state.objectives, createObjective({ x, y, type })]
  })),

  removeBase: (index) => set(state => ({ bases: state.bases.filter((_, i) => i !== index) })),
  removeTerrain: (index) => set(state => ({ terrains: state.terrains.filter((_, i) => i !== index) })),
  removeObjective: (index) => set(state => ({ objectives: state.objectives.filter((_, i) => i !== index) })),

  updateBasePosition: (index, x, y) => set(state => ({
    bases: state.bases.map((b, i) => i === index ? { ...b, x, y } : b)
  })),
  updateTerrainPosition: (index, x, y) => set(state => ({
    terrains: state.terrains.map((t, i) => i === index ? { ...t, x, y } : t)
  })),
  updateObjectivePosition: (index, x, y) => set(state => ({
    objectives: state.objectives.map((o, i) => i === index ? { ...o, x, y } : o)
  })),

  toggleBaseFlag: (index, flag) => set(state => ({
    bases: state.bases.map((b, i) => i === index ? { ...b, [flag]: !b[flag] } : b)
  })),

  toggleAllBaseFlag: (flag) => set(state => {
    const enableCount = state.bases.filter(b => b[flag]).length;
    const shouldEnable = enableCount === 0; // if none enabled, enable all; otherwise disable all
    return {
      bases: state.bases.map(b => ({ ...b, [flag]: shouldEnable ? true : false }))
    };
  }),

  clearAll: () => set({ bases: [], terrains: [], objectives: [] }),

  // Selectors/utilities
  boardPixels: () => ({ width: BOARD.WIDTH * BOARD.SCALE, height: BOARD.HEIGHT * BOARD.SCALE }),
  scale: () => BOARD.SCALE,
}));
