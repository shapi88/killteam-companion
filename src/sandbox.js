import React, { useEffect, useRef, useState } from 'react';
import { renderSandbox } from './utils/sandboxCanvas';

/**
 * React Sandbox component for Kill Team canvas tooling.
 * - Uses local state and canvas ref (no direct DOM queries)
 * - Rendering is delegated to utils for clarity
 */
export default function Sandbox() {
  const canvasRef = useRef(null);

  const [board] = useState({ width: 30, height: 22, scale: 30 });

  const [bases, setBases] = useState([]);
  const [terrains, setTerrains] = useState([]);
  const [objectives, setObjectives] = useState([]);

  const [deploymentType, setDeploymentType] = useState('opposite_long');
  const [snapToGrid, setSnapToGrid] = useState(true);

  const [movement, setMovement] = useState(6);
  const [chargeRange, setChargeRange] = useState(6);
  const [shootingRange, setShootingRange] = useState(6);

  const [showLOS, setShowLOS] = useState(false);
  const [showVisibility, setShowVisibility] = useState(false);
  const [showShooting, setShowShooting] = useState(false);
  const [showMovement, setShowMovement] = useState(false);
  const [showCharge, setShowCharge] = useState(false);

  const [baseSize, setBaseSize] = useState(0.63); // 32mm default
  const [baseElevation, setBaseElevation] = useState(0);

  const [terrainWidth, setTerrainWidth] = useState(2);
  const [terrainHeight, setTerrainHeight] = useState(2);
  const [terrainElevation, setTerrainElevation] = useState(0);
  const [terrainType, setTerrainType] = useState('light');

  const [objectiveType, setObjectiveType] = useState('primary');

  // Selection state for dragging
  const [selected, setSelected] = useState(null); // { type: 'base'|'terrain'|'objective', index: number }

  function snap(x, y) {
    return { x: snapToGrid ? Math.round(x) : x, y: snapToGrid ? Math.round(y) : y };
  }

  function addBase(player) {
    const x = Math.random() * board.width;
    const y = Math.random() * board.height;
    setBases(prev => [...prev, { x, y, radius: baseSize, player, elevation: baseElevation }]);
  }

  function addTerrain() {
    const x = (board.width - terrainWidth) / 2;
    const y = (board.height - terrainHeight) / 2;
    setTerrains(prev => [...prev, { x, y, w: terrainWidth, h: terrainHeight, elevation: terrainElevation, type: terrainType }]);
  }

  function addObjective() {
    const x = board.width / 2;
    const y = board.height / 2;
    setObjectives(prev => [...prev, { x, y, type: objectiveType }]);
  }

  function clearAll() {
    setBases([]); setTerrains([]); setObjectives([]);
  }

  // Mouse interactions
  function onMouseDown(e) {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / board.scale;
    const mouseY = (e.clientY - rect.top) / board.scale;

    // Find base
    for (let i = 0; i < bases.length; i++) {
      const b = bases[i];
      const dx = mouseX - b.x; const dy = mouseY - b.y;
      if (Math.sqrt(dx * dx + dy * dy) <= b.radius) {
        setSelected({ type: 'base', index: i });
        return;
      }
    }
    // Find terrain
    for (let i = 0; i < terrains.length; i++) {
      const t = terrains[i];
      if (mouseX >= t.x && mouseX <= t.x + t.w && mouseY >= t.y && mouseY <= t.y + t.h) {
        setSelected({ type: 'terrain', index: i });
        return;
      }
    }
    // Find objective
    for (let i = 0; i < objectives.length; i++) {
      const o = objectives[i];
      const dx = mouseX - o.x; const dy = mouseY - o.y;
      if (Math.sqrt(dx * dx + dy * dy) <= 0.5) {
        setSelected({ type: 'objective', index: i });
        return;
      }
    }
  }

  function onMouseMove(e) {
    if (!selected || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / board.scale;
    const mouseY = (e.clientY - rect.top) / board.scale;
    const s = snap(mouseX, mouseY);

    if (selected.type === 'base') {
      setBases(prev => prev.map((b, i) => i === selected.index ? { ...b, x: s.x, y: s.y } : b));
    } else if (selected.type === 'terrain') {
      setTerrains(prev => prev.map((t, i) => i === selected.index ? { ...t, x: s.x - t.w / 2, y: s.y - t.h / 2 } : t));
    } else if (selected.type === 'objective') {
      setObjectives(prev => prev.map((o, i) => i === selected.index ? { ...o, x: s.x, y: s.y } : o));
    }
  }

  function onMouseUp() { setSelected(null); }

  // Draw on any state change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    renderSandbox(ctx, board.scale, {
      bases,
      terrains,
      objectives,
      deploymentType,
      showLOS,
      showVisibility,
      showShooting,
      showMovement,
      showCharge,
      snapToGrid,
      boardWidth: board.width,
      boardHeight: board.height,
      movement,
      chargeRange,
      shootingRange
    });
  }, [bases, terrains, objectives, deploymentType, showLOS, showVisibility, showShooting, showMovement, showCharge, snapToGrid, board, movement, chargeRange, shootingRange]);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Sandbox</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem' }}>
        <label>
          Deployment
          <select value={deploymentType} onChange={e => setDeploymentType(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="opposite_long">Opposite Long</option>
            <option value="opposite_short">Opposite Short</option>
            <option value="quarters">Quarters</option>
            <option value="diagonal">Diagonal</option>
            <option value="loot">Loot</option>
            <option value="control">Control</option>
          </select>
        </label>
        <button onClick={() => addBase(1)}>Add P1 Base</button>
        <button onClick={() => addBase(2)}>Add P2 Base</button>
        <label>
          Base Size
          <select value={baseSize} onChange={e => setBaseSize(parseFloat(e.target.value))} style={{ marginLeft: 8 }}>
            <option value={0.5}>25mm</option>
            <option value={0.63}>32mm</option>
            <option value={0.79}>40mm</option>
            <option value={0.98}>50mm</option>
          </select>
        </label>
        <label>
          Elevation
          <select value={baseElevation} onChange={e => setBaseElevation(parseInt(e.target.value, 10))} style={{ marginLeft: 8 }}>
            <option value={0}>0"</option>
            <option value={1}>1"</option>
            <option value={2}>2"</option>
            <option value={3}>3"</option>
            <option value={4}>4"</option>
            <option value={5}>5+"</option>
          </select>
        </label>
        <label>
          Movement
          <input type="number" min={1} step={1} value={movement} onChange={e => setMovement(parseInt(e.target.value, 10) || 0)} style={{ marginLeft: 8, width: 64 }} />
        </label>
        <label>
          Charge
          <input type="number" min={1} step={1} value={chargeRange} onChange={e => setChargeRange(parseInt(e.target.value, 10) || 0)} style={{ marginLeft: 8, width: 64 }} />
        </label>
        <label>
          Shooting
          <input type="number" min={1} step={1} value={shootingRange} onChange={e => setShootingRange(parseInt(e.target.value, 10) || 0)} style={{ marginLeft: 8, width: 64 }} />
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={snapToGrid} onChange={e => setSnapToGrid(e.target.checked)} />
          Snap Grid
        </label>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem' }}>
        <label>
          Terrain W
          <input type="number" value={terrainWidth} step={0.5} min={0.1} onChange={e => setTerrainWidth(parseFloat(e.target.value) || 0)} style={{ marginLeft: 8, width: 72 }} />
        </label>
        <label>
          H
          <input type="number" value={terrainHeight} step={0.5} min={0.1} onChange={e => setTerrainHeight(parseFloat(e.target.value) || 0)} style={{ marginLeft: 8, width: 72 }} />
        </label>
        <label>
          Height
          <input type="number" value={terrainElevation} step={1} min={0} onChange={e => setTerrainElevation(parseFloat(e.target.value) || 0)} style={{ marginLeft: 8, width: 72 }} />
        </label>
        <label>
          Type
          <select value={terrainType} onChange={e => setTerrainType(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="light">Light</option>
            <option value="heavy">Heavy/Obscuring</option>
            <option value="vantage">Vantage</option>
          </select>
        </label>
        <button onClick={addTerrain}>Add Terrain</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem' }}>
        <label>
          Objective
          <select value={objectiveType} onChange={e => setObjectiveType(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="token">Token</option>
          </select>
        </label>
        <button onClick={addObjective}>Add Objective</button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem' }}>
        <button onClick={() => setShowShooting(s => !s)}>Toggle Shooting</button>
        <button onClick={() => setShowCharge(s => !s)}>Toggle Charge</button>
        <button onClick={() => setShowLOS(s => !s)}>Toggle LOS</button>
        <button onClick={() => setShowVisibility(s => !s)}>Toggle Visibility</button>
        <button onClick={() => setShowMovement(s => !s)}>Toggle Movement</button>
        <button onClick={clearAll}>Clear All</button>
      </div>

      <canvas
        ref={canvasRef}
        width={board.width * board.scale}
        height={board.height * board.scale}
        style={{ border: '2px solid #333', backgroundColor: '#e0e0e0', display: 'block', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', cursor: 'default' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      />
    </div>
  );
}
