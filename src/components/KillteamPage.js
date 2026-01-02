import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useKillteamDetails } from '../hooks/useKillteamDetails';

const section = { marginBottom: 24 };
const card = { border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginBottom: 12, background: 'white' };
const sub = { color: '#6b7280', fontSize: 14 };

export default function KillteamPage() {
  const { killteamId } = useParams();
  const { killteam, loading, error } = useKillteamDetails(killteamId);

  if (loading) return <div>Loading…</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!killteam) return <div>Killteam not found.</div>;

  const kt = killteam.killteam;
  const faction = killteam.faction;

  return (
    <div>
      <div style={{ marginBottom: 12 }}><Link to="/killteams">← Back to Kill Teams</Link></div>

      <h1 style={{ marginBottom: 4 }}>{kt.killteamName}</h1>
      {faction && <div style={sub}>Faction: {faction.factionName}</div>}

      {kt.archetypes && <div style={{ ...sub, marginTop: 6 }}>Archetypes: {kt.archetypes}</div>}

      <div style={{ ...section, marginTop: 16 }}>
        <h3>Composition</h3>
        <div style={card}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{kt.composition || '—'}</pre>
        </div>
      </div>

      {faction && (
        <div style={section}>
          <h3>Faction</h3>
          <div style={card}>
            <div><strong>{faction.factionName}</strong> (Seq: {faction.seq})</div>
            <div style={{ marginTop: 8 }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{faction.description}</pre>
            </div>
          </div>
        </div>
      )}

      <div style={section}>
        <h3>Operative Types</h3>
        {(killteam.optypes || []).map((ot) => (
          <div key={ot.opType.opTypeId} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h4 style={{ margin: 0 }}>{ot.opType.opTypeName}</h4>
              <div style={sub}>SEQ: {ot.opType.seq}</div>
            </div>
            <div style={{ ...sub, marginTop: 4 }}>
              MOVE {ot.opType.MOVE} • APL {ot.opType.APL} • SAVE {ot.opType.SAVE} • WOUNDS {ot.opType.WOUNDS}
            </div>
            {!!ot.opType.keywords && <div style={{ ...sub, marginTop: 2 }}>Keywords: {ot.opType.keywords}</div>}

            {ot.abilities?.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <strong>Abilities</strong>
                {ot.abilities.map((ab) => (
                  <div key={ab.abilityId} style={{ marginTop: 6 }}>
                    <div><em>{ab.abilityName}</em> {typeof ab.AP === 'number' ? `(AP ${ab.AP})` : ''}</div>
                    <div style={sub}><pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{ab.description}</pre></div>
                  </div>
                ))}
              </div>
            )}

            {ot.options?.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <strong>Options</strong>
                {ot.options.map((op) => (
                  <div key={op.optionId} style={{ marginTop: 6 }}>
                    <div><em>{op.optionName}</em></div>
                    {op.effects && <div style={sub}>Effects: {op.effects}</div>}
                    <div style={sub}><pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{op.description}</pre></div>
                  </div>
                ))}
              </div>
            )}

            {ot.weapons?.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <strong>Weapons</strong>
                {ot.weapons.map((w) => (
                  <div key={w.weapon.wepId} style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed #e5e7eb' }}>
                    <div>
                      <em>{w.weapon.wepName}</em> {w.weapon.isDefault ? <span style={sub}>(default)</span> : null} • Type {w.weapon.wepType}
                    </div>
                    {w.profiles?.length > 0 && (
                      <div style={{ marginTop: 6 }}>
                        <div style={{ ...sub, marginBottom: 2 }}>Profiles:</div>
                        {w.profiles.map((p) => (
                          <div key={p.wepprofileId} style={{ ...sub }}>
                            ATK {p.ATK} • HIT {p.HIT} • DMG {p.DMG} {p.WR ? `• WR ${p.WR}` : ''}
                          </div>
                        ))}
                      </div>
                    )}
                    {w.rules?.length > 0 && (
                      <div style={{ marginTop: 6 }}>
                        <div style={{ ...sub, marginBottom: 2 }}>Rules:</div>
                        {w.rules.map((r) => (
                          <div key={r.code} style={{ ...sub }}>
                            <strong>{r.ruleName}</strong>: {r.description}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {killteam.equipments?.length > 0 && (
        <div style={section}>
          <h3>Equipments</h3>
          <div style={card}>
            {killteam.equipments.map((eq) => (
              <div key={eq.eqId} style={{ marginBottom: 8 }}>
                <div><strong>{eq.eqName}</strong></div>
                {eq.effects && <div style={sub}>Effects: {eq.effects}</div>}
                <div style={sub}><pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{eq.description}</pre></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {killteam.ploys?.length > 0 && (
        <div style={section}>
          <h3>Ploys</h3>
          <div style={card}>
            {killteam.ploys.map((pl) => (
              <div key={pl.ployId} style={{ marginBottom: 8 }}>
                <div>
                  <strong>{pl.ployName}</strong> {pl.ployType ? <span style={sub}>(Type: {pl.ployType})</span> : null}
                </div>
                {pl.effects && <div style={sub}>Effects: {pl.effects}</div>}
                <div style={sub}><pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{pl.description}</pre></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
