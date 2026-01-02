// Simple factories for Sandbox domain objects

export function createBase(player, { x, y, radius, elevation }) {
  return { x, y, radius, player, elevation };
}

export function createTerrain({ x, y, w, h, elevation, type }) {
  return { x, y, w, h, elevation, type };
}

export function createObjective({ x, y, type }) {
  return { x, y, type };
}

export function initialSandboxState(board) {
  return {
    bases: [],
    terrains: [],
    objectives: [],
    boardWidth: board.WIDTH,
    boardHeight: board.HEIGHT
  };
}
