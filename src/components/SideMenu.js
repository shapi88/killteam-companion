import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoverIndex, setHoverIndex] = useState(null);

  const items = [
    { label: 'Home', path: '/home', icon: '🏠' },
    { label: 'Kill Teams', path: '/killteams', icon: '🪖' },
    { label: 'Factions', path: '/pdf-viewer', icon: '📚' },
    { label: 'Weapon Rules', path: '/weapon-rules', icon: '🔫' },
    { label: 'Universal Equipments', path: '/universal-equipments', icon: '🎒' },
    { label: 'Game Setup', path: '/game-setup', icon: '⚙️' }
  ];

  return (
    <div style={{ backgroundColor: '#111827', color: 'white', width: 256, minHeight: '100vh', padding: '1rem', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
          <span style={{ fontSize: 18 }}>KT</span>
        </div>
        <div>
          <h2 style={{ fontSize: 18, margin: 0 }}>Kill Team Tools</h2>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>Quick access</div>
        </div>
      </div>

      <Nav className="flex-column" style={{ gap: 8 }}>
        {items.map((item, index) => {
          const isActive = location.pathname === item.path || (item.path === '/home' && location.pathname === '/');
          const bg = isActive ? '#2563EB' : (hoverIndex === index ? '#374151' : 'transparent');
          return (
            <Nav.Link
              key={item.path}
              onClick={() => navigate(item.path)}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              className="d-block text-start"
              style={{
                color: 'white',
                backgroundColor: bg,
                padding: '10px 12px',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon} </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {isActive && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>Active</span>}
            </Nav.Link>
          );
        })}
      </Nav>

      <div style={{ marginTop: 16, marginBottom: 8, color: '#9CA3AF', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Playground</div>
      <Nav className="flex-column" style={{ gap: 8 }}>
        {(() => {
          const item = { label: 'Sandbox', path: '/sandbox', icon: '🧪' };
          const isActive = location.pathname === item.path;
          const bg = isActive ? '#10B981' : 'transparent';
          return (
            <Nav.Link
              key={item.path}
              onClick={() => navigate(item.path)}
              className="d-block text-start"
              style={{
                color: 'white',
                backgroundColor: bg,
                padding: '10px 12px',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                textDecoration: 'none',
                border: isActive ? '1px solid #10B981' : '1px solid transparent'
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon} </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {isActive && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>Active</span>}
            </Nav.Link>
          );
        })()}
      </Nav>

      <div style={{ marginTop: 'auto', fontSize: 12, color: '#9CA3AF' }}>
        <div>v1.0</div>
        <div style={{ marginTop: 6 }}>Built for quick reference</div>
      </div>
    </div>
  );
};

export default SideMenu;