/**
 * Canvas rendering helpers for the Sandbox tool.
 * Keeps rendering logic separate from React component for readability.
 */

/**
 * @typedef {{ x:number, y:number, radius:number, player:1|2, elevation:number }} Base
 * @typedef {{ x:number, y:number, w:number, h:number, elevation:number, type:'light'|'heavy'|'vantage' }} Terrain
 * @typedef {{ x:number, y:number, type:'primary'|'secondary'|'token' }} Objective
 * @typedef {{
 *   bases: Base[],
 *   terrains: Terrain[],
 *   objectives: Objective[],
 *   deploymentType: 'opposite_long'|'opposite_short'|'quarters'|'diagonal'|'loot'|'control',
 *   showLOS: boolean,
 *   showVisibility: boolean,
 *   showShooting: boolean,
 *   showMovement: boolean,
 *   showCharge: boolean,
 *   snapToGrid: boolean,
 *   boardWidth: number,
 *   boardHeight: number,
 *   movement: number,
 *   chargeRange: number,
 *   shootingRange: number
 * }} SandboxState
 */

import { SANDBOX_DRAW } from '../constants/sandbox';

function dist(x1, y1, x2, y2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

function linesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  const dx1 = x2 - x1; const dy1 = y2 - y1;
  const dx2 = x4 - x3; const dy2 = y4 - y3;
  const denom = dx1 * dy2 - dy1 * dx2;
  if (Math.abs(denom) < 1e-10) return false;
  const t = ((x3 - x1) * dy2 - (y3 - y1) * dx2) / denom;
  const u = ((x3 - x1) * dy1 - (y3 - y1) * dx1) / denom;
  return t > 0 && t < 1 && u >= 0 && u <= 1;
}

function lineIntersectsRect(x1, y1, x2, y2, rx, ry, rw, rh) {
  return (
    linesIntersect(x1, y1, x2, y2, rx, ry, rx, ry + rh) ||
    linesIntersect(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh) ||
    linesIntersect(x1, y1, x2, y2, rx, ry, rx + rw, ry) ||
    linesIntersect(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh)
  );
}

function minDistCircleRect(cx, cy, cr, rx, ry, rw, rh) {
  const closestX = Math.max(rx, Math.min(cx, rx + rw));
  const closestY = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - closestX;
  const dy = cy - closestY;
  const distCenter = Math.sqrt(dx * dx + dy * dy);
  return Math.max(0, distCenter - cr);
}

function generateRayPoints(bx, by, r) {
  const points = [];
  for (let i = 0; i < SANDBOX_DRAW.NUM_RAYS; i++) {
    const angle = (i / SANDBOX_DRAW.NUM_RAYS) * 2 * Math.PI;
    points.push({ x: bx + r * Math.cos(angle), y: by + r * Math.sin(angle) });
  }
  return points;
}

function computeLOSStatus(shooter, target, terrains) {
  const sPoints = generateRayPoints(shooter.x, shooter.y, shooter.radius);
  const tPoints = generateRayPoints(target.x, target.y, target.radius);
  const crossedTerrains = new Set();
  let visible = false;
  const distance = dist(shooter.x, shooter.y, target.x, target.y);

  for (let sp of sPoints) {
    for (let tp of tPoints) {
      let rayBlocked = false;
      for (let ti = 0; ti < terrains.length; ti++) {
        const t = terrains[ti];
        if (lineIntersectsRect(sp.x, sp.y, tp.x, tp.y, t.x, t.y, t.w, t.h)) {
          crossedTerrains.add(ti);
          if (shooter.elevation <= t.elevation || target.elevation <= t.elevation) {
            rayBlocked = true;
          }
        }
      }
      if (!rayBlocked) visible = true;
    }
  }

  let obscured = false;
  let cover = 'none';
  let vantage = false;

  if (distance > 2) {
    for (let ti of crossedTerrains) {
      const t = terrains[ti];
      const withinShooter = minDistCircleRect(shooter.x, shooter.y, shooter.radius, t.x, t.y, t.w, t.h) <= 1;
      const withinTarget = minDistCircleRect(target.x, target.y, target.radius, t.x, t.y, t.w, t.h) <= 1;
      const isHeavy = t.type === 'heavy';
      const isVantage = t.type === 'vantage';

      if (shooter.elevation > t.elevation && isVantage) {
        vantage = true;
        continue;
      }
      if (isHeavy && !withinShooter && !withinTarget) obscured = true;
      if (withinTarget) cover = isHeavy ? 'heavy' : 'light';
    }
  }
  if (vantage) { cover = 'none'; obscured = false; }
  return { visible, obscured, cover, distance: distance.toFixed(1), vantage };
}

function drawGrid(ctx, scale, bw, bh) {
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 1;
  for (let x = 0; x <= bw; x += 1) {
    ctx.beginPath();
    ctx.moveTo(x * scale, 0);
    ctx.lineTo(x * scale, bh * scale);
    ctx.stroke();
  }
  for (let y = 0; y <= bh; y += 1) {
    ctx.beginPath();
    ctx.moveTo(0, y * scale);
    ctx.lineTo(bw * scale, y * scale);
    ctx.stroke();
  }
}

function drawDeploymentZones(ctx, scale, bw, bh, type) {
  ctx.globalAlpha = 0.2;
  const dropZoneSize = 3;
  if (type === 'opposite_long') {
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, (bh - dropZoneSize) * scale, bw * scale, dropZoneSize * scale);
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, bw * scale, dropZoneSize * scale);
  } else if (type === 'opposite_short') {
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, dropZoneSize * scale, bh * scale);
    ctx.fillStyle = 'red';
    ctx.fillRect((bw - dropZoneSize) * scale, 0, dropZoneSize * scale, bh * scale);
  } else if (type === 'quarters') {
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, (bh / 2) * scale, (bw / 2) * scale, (bh / 2) * scale);
    ctx.fillStyle = 'red';
    ctx.fillRect((bw / 2) * scale, 0, (bw / 2) * scale, (bh / 2) * scale);
  } else if (type === 'diagonal') {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(0, bh * scale);
    ctx.lineTo(0, 0);
    ctx.lineTo(bw * scale, bh * scale);
    ctx.fill();
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(bw * scale, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(bw * scale, bh * scale);
    ctx.fill();
  } else if (type === 'loot') {
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, (bh - 9) * scale, bw * scale, 9 * scale);
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 3 * scale, bw * scale, 9 * scale);
  } else if (type === 'control') {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(0, bh * scale);
    ctx.lineTo(0, (bh / 2) * scale);
    ctx.lineTo((bw / 2) * scale, bh * scale);
    ctx.fill();
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(bw * scale, 0);
    ctx.lineTo(bw * scale, (bh / 2) * scale);
    ctx.lineTo((bw / 2) * scale, 0);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawTerrains(ctx, scale, terrains) {
  terrains.forEach(t => {
    ctx.fillStyle = t.type === 'vantage' ? '#32cd32' : (t.type === 'light' ? '#a52a2a' : '#696969');
    ctx.fillRect(t.x * scale, t.y * scale, t.w * scale, t.h * scale);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(t.x * scale, t.y * scale, t.w * scale, t.h * scale);
  });
}

function drawObjectives(ctx, scale, objectives) {
  objectives.forEach(obj => {
    const color = obj.type === 'primary' ? 'gold' : obj.type === 'secondary' ? 'orange' : 'purple';
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(obj.x * scale, obj.y * scale, 0.5 * scale, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(obj.type[0].toUpperCase(), obj.x * scale, obj.y * scale);
  });
}

function drawBases(ctx, scale, bases) {
  bases.forEach(base => {
    ctx.fillStyle = base.player === 1 ? '#0066cc' : '#cc0000';
    ctx.beginPath();
    ctx.arc(base.x * scale, base.y * scale, base.radius * scale, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

function drawCenterLines(ctx, scale, bw, bh) {
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(0, (bh / 2) * scale);
  ctx.lineTo(bw * scale, (bh / 2) * scale);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo((bw / 2) * scale, 0);
  ctx.lineTo((bw / 2) * scale, bh * scale);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc((bw / 2) * scale, (bh / 2) * scale, 0.2 * scale, 0, 2 * Math.PI);
  ctx.fill();
}

function drawVisibility(ctx, scale, bases, terrains) {
  bases.forEach(base => {
    const cx = base.x;
    const cy = base.y;
    const colorBase = base.player === 1 ? [0, 102, 204] : [204, 0, 0];
    for (let i = 0; i < SANDBOX_DRAW.NUM_VISIBILITY_RAYS; i++) {
      const angle = (i / SANDBOX_DRAW.NUM_VISIBILITY_RAYS) * 2 * Math.PI;
      let maxDist = SANDBOX_DRAW.VISIBILITY_RADIUS;
      for (let d = 0.2; d <= SANDBOX_DRAW.VISIBILITY_RADIUS; d += 0.3) {
        const px = cx + d * Math.cos(angle);
        const py = cy + d * Math.sin(angle);
        let blocked = false;
        for (let t of terrains) {
          if (lineIntersectsRect(cx, cy, px, py, t.x, t.y, t.w, t.h) && base.elevation <= t.elevation) {
            blocked = true; break;
          }
        }
        if (blocked) { maxDist = d - 0.3; break; }
      }
      const gradient = ctx.createLinearGradient(cx * scale, cy * scale, (cx + maxDist * Math.cos(angle)) * scale, (cy + maxDist * Math.sin(angle)) * scale);
      gradient.addColorStop(0, `rgba(${colorBase[0]}, ${colorBase[1]}, ${colorBase[2]}, 0.6)`);
      gradient.addColorStop(1, `rgba(${colorBase[0]}, ${colorBase[1]}, ${colorBase[2]}, 0.05)`);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(cx * scale, cy * scale);
      ctx.lineTo((cx + maxDist * Math.cos(angle)) * scale, (cy + maxDist * Math.sin(angle)) * scale);
      ctx.stroke();
    }
  });
}

function drawRangeCircle(ctx, scale, bases, inches, color, alpha = 0.2) {
  bases.forEach(base => {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color(base);
    ctx.beginPath();
    ctx.arc(base.x * scale, base.y * scale, inches * scale, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}

function drawLOS(ctx, scale, bases, terrains) {
  for (let i = 0; i < bases.length; i++) {
    for (let j = i + 1; j < bases.length; j++) {
      const b1 = bases[i];
      const b2 = bases[j];
      if (b1.player === b2.player) continue;
      const shooter = b1.player === 1 ? b1 : b2;
      const target = b1.player === 1 ? b2 : b1;
      const status = computeLOSStatus(shooter, target, terrains);

      const sx = b1.x * scale;
      const sy = b1.y * scale;
      const tx = b2.x * scale;
      const ty = b2.y * scale;
      const mx = (b1.x + b2.x) / 2 * scale;
      const my = (b1.y + b2.y) / 2 * scale;

      let lineColor, lineDash, label;
      if (!status.visible) {
        lineColor = 'red'; lineDash = [10, 5]; label = `No LOS (${status.distance}")`;
      } else if (status.vantage) {
        lineColor = 'lime'; lineDash = []; label = `Clear (Vantage) (${status.distance}")`;
      } else if (status.obscured) {
        lineColor = 'orange'; lineDash = []; label = `Obscured (${status.distance}")`;
      } else if (status.cover !== 'none') {
        lineColor = status.cover === 'heavy' ? 'purple' : 'yellow'; lineDash = []; label = `${status.cover === 'heavy' ? 'Heavy' : 'Light'} Cover (${status.distance}")`;
      } else {
        lineColor = 'lime'; lineDash = []; label = `Clear (${status.distance}")`;
      }

      ctx.setLineDash(lineDash);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = 'black';
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.strokeText(label, mx, my);
      ctx.lineWidth = 1;
      ctx.strokeText(label, mx, my);
      ctx.fillText(label, mx, my);
    }
  }
}

/**
 * Render the entire sandbox view.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} scale pixels per inch
 * @param {SandboxState} state
 */
export function renderSandbox(ctx, scale, state) {
  const { boardWidth: bw, boardHeight: bh } = state;
  ctx.clearRect(0, 0, bw * scale, bh * scale);
  drawGrid(ctx, scale, bw, bh);
  drawDeploymentZones(ctx, scale, bw, bh, state.deploymentType);
  drawTerrains(ctx, scale, state.terrains);
  drawObjectives(ctx, scale, state.objectives);
  drawBases(ctx, scale, state.bases);
  // Per-base toggles
  const visBases = state.bases.filter(b => b.showVisibility);
  if (visBases.length) drawVisibility(ctx, scale, visBases, state.terrains);
  const shootBases = state.bases.filter(b => b.showShooting);
  if (shootBases.length) drawRangeCircle(ctx, scale, shootBases, state.shootingRange, b => (b.player === 1 ? 'blue' : 'red'));
  const moveBases = state.bases.filter(b => b.showMovement);
  if (moveBases.length) drawRangeCircle(ctx, scale, moveBases, state.movement, b => (b.player === 1 ? '#00ff00' : '#ff00ff'), 0.15);
  const chargeBases = state.bases.filter(b => b.showCharge);
  if (chargeBases.length) drawRangeCircle(ctx, scale, chargeBases, state.chargeRange, b => (b.player === 1 ? '#ff8800' : '#ff00ff'), 0.15);
  drawCenterLines(ctx, scale, bw, bh);
  if (state.showLOS) drawLOS(ctx, scale, state.bases, state.terrains);
}

export const geometry = {
  dist,
  linesIntersect,
  lineIntersectsRect,
  minDistCircleRect
};
