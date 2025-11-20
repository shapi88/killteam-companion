import React from 'react';
import { Link } from 'react-router-dom';
import { useKillteams } from '../hooks/useKillteams';

const cardStyle = {
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: 12,
  marginBottom: 12,
  background: 'white'
};

export default function KillteamsList() {
  const { killteams, loading, error } = useKillteams();

  if (loading) return <div>Loading kill teams…</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>Kill Teams</h1>
      <div>
        {killteams.map((kt) => (
          <div key={kt.killteam.killteamId} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ margin: 0 }}>{kt.killteam.killteamName}</h3>
              <div style={{ color: '#6b7280' }}>{kt.faction ? kt.faction.factionName : 'Unknown Faction'}</div>
            </div>
            {kt.killteam.archetypes && (
              <div style={{ color: '#4b5563', fontSize: 14, marginTop: 4 }}>Archetypes: {kt.killteam.archetypes}</div>
            )}
            <div style={{ marginTop: 8 }}>
              <Link to={`/killteams/${kt.killteam.killteamId}`}>View details →</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
