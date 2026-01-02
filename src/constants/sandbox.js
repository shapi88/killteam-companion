// Centralized constants for the Sandbox feature

export const BOARD = {
  WIDTH: 30,
  HEIGHT: 22,
  SCALE: 30
};

export const BASE_SIZES = [
  { label: '25mm', value: 0.5 },
  { label: '32mm', value: 0.63 },
  { label: '40mm', value: 0.79 },
  { label: '50mm', value: 0.98 }
];

export const ELEVATIONS = [0, 1, 2, 3, 4, 5];

export const TERRAIN_TYPES = [
  { label: 'Light', value: 'light' },
  { label: 'Heavy/Obscuring', value: 'heavy' },
  { label: 'Vantage', value: 'vantage' }
];

export const OBJECTIVE_TYPES = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Token', value: 'token' }
];

export const DEPLOYMENTS = [
  { label: 'Opposite Long', value: 'opposite_long' },
  { label: 'Opposite Short', value: 'opposite_short' },
  { label: 'Quarters', value: 'quarters' },
  { label: 'Diagonal', value: 'diagonal' },
  { label: 'Loot', value: 'loot' },
  { label: 'Control', value: 'control' }
];

export const DEFAULTS = {
  deploymentType: 'opposite_long',
  snapToGrid: true,
  baseSize: 0.63,
  baseElevation: 0,
  movement: 6,
  chargeRange: 6,
  shootingRange: 6,
  terrainWidth: 2,
  terrainHeight: 2,
  terrainElevation: 0,
  terrainType: 'light',
  objectiveType: 'primary'
};

export const SANDBOX_DRAW = {
  NUM_RAYS: 12,
  NUM_VISIBILITY_RAYS: 90,
  VISIBILITY_RADIUS: 12
};
