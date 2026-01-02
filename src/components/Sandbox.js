import React, { useEffect, useRef, useState } from 'react';
import { BOARD, BASE_SIZES, ELEVATIONS, TERRAIN_TYPES, OBJECTIVE_TYPES, DEPLOYMENTS, DEFAULTS } from '../constants/sandbox';
import { renderSandbox } from '../utils/sandboxCanvas';
import { useSandboxStore } from '../stores/useSandboxStore';

export default function Sandbox() {
  const canvasRef = useRef(null);

  // Global store selectors
  const bases = useSandboxStore(s => s.bases);
  const terrains = useSandboxStore(s => s.terrains);
  const objectives = useSandboxStore(s => s.objectives);

  const deploymentType = useSandboxStore(s => s.deploymentType);
  const snapToGrid = useSandboxStore(s => s.snapToGrid);
  const movement = useSandboxStore(s => s.movement);
  const chargeRange = useSandboxStore(s => s.chargeRange);
  const shootingRange = useSandboxStore(s => s.shootingRange);
  const showLOS = useSandboxStore(s => s.showLOS);

  const setDeploymentType = useSandboxStore(s => s.setDeploymentType);
  const setSnapToGrid = useSandboxStore(s => s.setSnapToGrid);
  const setMovement = useSandboxStore(s => s.setMovement);
  const setChargeRange = useSandboxStore(s => s.setChargeRange);
  const setShootingRange = useSandboxStore(s => s.setShootingRange);
  const setShowLOS = useSandboxStore(s => s.setShowLOS);

  const addBaseGlobal = useSandboxStore(s => s.addBase);
  const addTerrainGlobal = useSandboxStore(s => s.addTerrain);
  const addObjectiveGlobal = useSandboxStore(s => s.addObjective);
  const updateBasePosition = useSandboxStore(s => s.updateBasePosition);
  const updateTerrainPosition = useSandboxStore(s => s.updateTerrainPosition);
  const updateObjectivePosition = useSandboxStore(s => s.updateObjectivePosition);
  const removeBase = useSandboxStore(s => s.removeBase);
  const removeTerrain = useSandboxStore(s => s.removeTerrain);
  const removeObjective = useSandboxStore(s => s.removeObjective);
  const toggleBaseFlag = useSandboxStore(s => s.toggleBaseFlag);
  const toggleAllBaseFlag = useSandboxStore(s => s.toggleAllBaseFlag);
  const clearAll = useSandboxStore(s => s.clearAll);

  const [baseSize, setBaseSize] = useState(DEFAULTS.baseSize);
  const [baseElevation, setBaseElevation] = useState(DEFAULTS.baseElevation);

  const [terrainWidth, setTerrainWidth] = useState(DEFAULTS.terrainWidth);
  const [terrainHeight, setTerrainHeight] = useState(DEFAULTS.terrainHeight);
  const [terrainElevation, setTerrainElevation] = useState(DEFAULTS.terrainElevation);
  const [terrainType, setTerrainType] = useState(DEFAULTS.terrainType);

  const [objectiveType, setObjectiveType] = useState(DEFAULTS.objectiveType);

  const [selected, setSelected] = useState(null);

  function snap(x, y) {
    return { x: snapToGrid ? Math.round(x) : x, y: snapToGrid ? Math.round(y) : y };
  }

  function addBase(player) {
    const x = Math.random() * BOARD.WIDTH;
    const y = Math.random() * BOARD.HEIGHT;
    addBaseGlobal(player, { x, y, radius: baseSize, elevation: baseElevation });
  }

  function addTerrain() {
    const x = (BOARD.WIDTH - terrainWidth) / 2;
    const y = (BOARD.HEIGHT - terrainHeight) / 2;
    addTerrainGlobal({ x, y, w: terrainWidth, h: terrainHeight, elevation: terrainElevation, type: terrainType });
  }

  function addObjective() {
    const x = BOARD.WIDTH / 2;
    const y = BOARD.HEIGHT / 2;
    addObjectiveGlobal({ x, y, type: objectiveType });
  }
  // clearAll provided by store

  function onMouseDown(e) {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / BOARD.SCALE;
    const mouseY = (e.clientY - rect.top) / BOARD.SCALE;

    for (let i = 0; i < bases.length; i++) {
      const b = bases[i];
      const dx = mouseX - b.x; const dy = mouseY - b.y;
      if (Math.sqrt(dx * dx + dy * dy) <= b.radius) { setSelected({ type: 'base', index: i }); return; }
    }
    for (let i = 0; i < terrains.length; i++) {
      const t = terrains[i];
      if (mouseX >= t.x && mouseX <= t.x + t.w && mouseY >= t.y && mouseY <= t.y + t.h) { setSelected({ type: 'terrain', index: i }); return; }
    }
    for (let i = 0; i < objectives.length; i++) {
      const o = objectives[i]; const dx = mouseX - o.x; const dy = mouseY - o.y;
      if (Math.sqrt(dx * dx + dy * dy) <= 0.5) { setSelected({ type: 'objective', index: i }); return; }
    }
  }

  function onMouseMove(e) {
    if (!selected || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / BOARD.SCALE;
    const mouseY = (e.clientY - rect.top) / BOARD.SCALE;
    const s = snap(mouseX, mouseY);

    if (selected.type === 'base') {
      updateBasePosition(selected.index, s.x, s.y);
    } else if (selected.type === 'terrain') {
      const t = terrains[selected.index];
      updateTerrainPosition(selected.index, s.x - t.w / 2, s.y - t.h / 2);
    } else if (selected.type === 'objective') {
      updateObjectivePosition(selected.index, s.x, s.y);
    }
  }

  function onMouseUp() { setSelected(null); }

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    renderSandbox(ctx, BOARD.SCALE, {
      bases, terrains, objectives,
      deploymentType,
      showLOS,
      snapToGrid,
      boardWidth: BOARD.WIDTH, boardHeight: BOARD.HEIGHT,
      movement, chargeRange, shootingRange
    });
  }, [bases, terrains, objectives, deploymentType, showLOS, snapToGrid, movement, chargeRange, shootingRange]);

  // Context menu state
  const [menu, setMenu] = useState({ open: false, x: 0, y: 0, target: null });

  function openContextMenu(e) {
    e.preventDefault();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / BOARD.SCALE;
    const mouseY = (e.clientY - rect.top) / BOARD.SCALE;

    // hit test bases
    for (let i = 0; i < bases.length; i++) {
      const b = bases[i];
      const dx = mouseX - b.x; const dy = mouseY - b.y;
      if (Math.sqrt(dx * dx + dy * dy) <= b.radius) {
        setMenu({ open: true, x: e.pageX, y: e.pageY, target: { type: 'base', index: i } });
        return;
      }
    }
    // terrains
    for (let i = 0; i < terrains.length; i++) {
      const t = terrains[i];
      if (mouseX >= t.x && mouseX <= t.x + t.w && mouseY >= t.y && mouseY <= t.y + t.h) {
        setMenu({ open: true, x: e.pageX, y: e.pageY, target: { type: 'terrain', index: i } });
        return;
      }
    }
    // objectives
    for (let i = 0; i < objectives.length; i++) {
      const o = objectives[i]; const dx = mouseX - o.x; const dy = mouseY - o.y;
      if (Math.sqrt(dx * dx + dy * dy) <= 0.5) {
        setMenu({ open: true, x: e.pageX, y: e.pageY, target: { type: 'objective', index: i } });
        return;
      }
    }
    setMenu({ open: false, x: 0, y: 0, target: null });
  }

  useEffect(() => {
    const handler = () => setMenu(m => ({ ...m, open: false }));
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Sandbox</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem' }}>
        <label>
          Deployment
          <select value={deploymentType} onChange={e => setDeploymentType(e.target.value)} style={{ marginLeft: 8 }}>
            {DEPLOYMENTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </label>
        <button onClick={() => addBase(1)}>Add P1 Base</button>
        <button onClick={() => addBase(2)}>Add P2 Base</button>
        <label>
          Base Size
          <select value={baseSize} onChange={e => setBaseSize(parseFloat(e.target.value))} style={{ marginLeft: 8 }}>
            {BASE_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
        <label>
          Elevation
          <select value={baseElevation} onChange={e => setBaseElevation(parseInt(e.target.value, 10))} style={{ marginLeft: 8 }}>
            {ELEVATIONS.map(elev => <option key={elev} value={elev}>{elev}"</option>)}
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
            {TERRAIN_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </label>
        <button onClick={addTerrain}>Add Terrain</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem' }}>
        <label>
          Objective
          <select value={objectiveType} onChange={e => setObjectiveType(e.target.value)} style={{ marginLeft: 8 }}>
            {OBJECTIVE_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>
        <button onClick={addObjective}>Add Objective</button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem' }}>
        <button onClick={() => toggleAllBaseFlag('showShooting')}>Toggle Shooting</button>
        <button onClick={() => toggleAllBaseFlag('showCharge')}>Toggle Charge</button>
        <button onClick={() => setShowLOS(!showLOS)}>Toggle LOS</button>
        <button onClick={() => toggleAllBaseFlag('showVisibility')}>Toggle Visibility</button>
        <button onClick={() => toggleAllBaseFlag('showMovement')}>Toggle Movement</button>
        <button onClick={clearAll}>Clear All</button>
      </div>

      <canvas
        ref={canvasRef}
        width={BOARD.WIDTH * BOARD.SCALE}
        height={BOARD.HEIGHT * BOARD.SCALE}
        style={{ border: '2px solid #333', backgroundColor: '#e0e0e0', display: 'block', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', cursor: 'default' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onContextMenu={openContextMenu}
      />
      {menu.open && menu.target && (
        <div style={{ position: 'absolute', top: menu.y, left: menu.x, background: '#fff', border: '1px solid #ccc', borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 1000, minWidth: 200 }}>
          {menu.target.type === 'base' ? (
            <div>
              <MenuItem label="Toggle Visibility" onClick={() => { toggleBaseFlag(menu.target.index, 'showVisibility'); setMenu(m => ({ ...m, open: false })); }} />
              <MenuItem label="Toggle Shooting" onClick={() => { toggleBaseFlag(menu.target.index, 'showShooting'); setMenu(m => ({ ...m, open: false })); }} />
              <MenuItem label="Toggle Movement" onClick={() => { toggleBaseFlag(menu.target.index, 'showMovement'); setMenu(m => ({ ...m, open: false })); }} />
              <MenuItem label="Toggle Charge" onClick={() => { toggleBaseFlag(menu.target.index, 'showCharge'); setMenu(m => ({ ...m, open: false })); }} />
              <Separator />
              <MenuItem danger label="Remove Base" onClick={() => { removeBase(menu.target.index); setMenu(m => ({ ...m, open: false })); }} />
            </div>
          ) : menu.target.type === 'terrain' ? (
            <div>
              <MenuItem danger label="Remove Terrain" onClick={() => { removeTerrain(menu.target.index); setMenu(m => ({ ...m, open: false })); }} />
            </div>
          ) : (
            <div>
              <MenuItem danger label="Remove Objective" onClick={() => { removeObjective(menu.target.index); setMenu(m => ({ ...m, open: false })); }} />
            </div>
          )}
          <Separator />
          <MenuItem label="Cancel" onClick={() => setMenu(m => ({ ...m, open: false }))} />
        </div>
      )}
    </div>
  );
}

function MenuItem({ label, onClick, danger }) {
  return (
    <div onClick={onClick} style={{ padding: '10px 14px', cursor: 'pointer', color: danger ? '#d9534f' : '#111' }} onMouseDown={e => e.preventDefault()}>
      {label}
    </div>
  );
}

function Separator() {
  return <div style={{ height: 1, background: '#eee', margin: '4px 0' }} />;
}
