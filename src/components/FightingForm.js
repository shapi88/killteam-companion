import React from 'react';
import { Form, Button, Card, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { TeamSelector } from './commons/TeamSelector';
import { OperatorSelector } from './commons/OperatorSelector';
import { WeaponSelector } from './commons/WeaponSelector';
import { StatInput } from './commons/StatInput';
import { SwitchInput } from './commons/SwitchInput';
import { useTeamSelection } from '../hooks/useTeamSelection';
import { useDamageCalculation } from '../hooks/useDamageCalculation';
import { MELEE_DEFAULTS } from '../models/Stats';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

/**
 * FightingForm component for calculating fighting phase outcomes.
 * @param {Object} props - Component props
 * @param {Object} props.teamData - Team data from JSON
 */
function FightingForm({ teamData }) {
  const {
    team: attTeam,
    operator: attOperator,
    weapon: attWeapon,
    stats: attStats,
    setTeam: setAttTeam,
    setOperator: setAttOperator,
    setWeapon: setAttWeapon,
    updateStat: updateAttStat,
    teams: attTeams,
    operators: attOperators,
    weapons: attWeapons,
  } = useTeamSelection(teamData, 'melee', MELEE_DEFAULTS);

  const {
    team: defTeam,
    operator: defOperator,
    weapon: defWeapon,
    stats: defStats,
    setTeam: setDefTeam,
    setOperator: setDefOperator,
    setWeapon: setDefWeapon,
    updateStat: updateDefStat,
    operators: defOperators,
    weapons: defWeapons,
    error: selectionError,
  } = useTeamSelection(teamData, 'melee', MELEE_DEFAULTS);

  const { result, loading, error: calcError, calculate } = useDamageCalculation('fighting');

  const handleCalculate = () => {
    calculate({ attStats, defStats });
  };

  return (
    <Form>
      <Row>
        <Col md={6}>
          <h3>Attacker</h3>
          <TeamSelector teams={attTeams} value={attTeam} onChange={setAttTeam} label="Team" />
          <OperatorSelector operators={attOperators} value={attOperator} onChange={setAttOperator} label="Operator" />
          <WeaponSelector weapons={attWeapons} value={attWeapon} onChange={setAttWeapon} label="Weapon" />
          <StatInput label="Attacks" type="number" value={attStats.attacks} onChange={(value) => updateAttStat('attacks', value)} min="0" />
          <StatInput label="Hit (WS)" type="number" value={attStats.hit} onChange={(value) => updateAttStat('hit', value)} min="2" max="6" />
          <StatInput label="Normal Damage" type="number" value={attStats.normalDmg} onChange={(value) => updateAttStat('normalDmg', value)} min="0" />
          <StatInput label="Critical Damage" type="number" value={attStats.critDmg} onChange={(value) => updateAttStat('critDmg', value)} min="0" />
          <StatInput label="Lethal (Crit on)" type="number" value={attStats.lethal} onChange={(value) => updateAttStat('lethal', value)} min="2" max="6" />
          <SwitchInput label="Balanced" checked={attStats.balanced} onChange={(value) => updateAttStat('balanced', value)} />
          <SwitchInput label="Ceaseless" checked={attStats.ceaseless} onChange={(value) => updateAttStat('ceaseless', value)} />
          <SwitchInput label="Relentless" checked={attStats.relentless} onChange={(value) => updateAttStat('relentless', value)} />
          <SwitchInput label="Rending" checked={attStats.rending} onChange={(value) => updateAttStat('rending', value)} />
          <SwitchInput label="Brutal" checked={attStats.brutal} onChange={(value) => updateAttStat('brutal', value)} />
          <SwitchInput label="Punishing" checked={attStats.punishing} onChange={(value) => updateAttStat('punishing', value)} />
          <SwitchInput label="Severe" checked={attStats.severe} onChange={(value) => updateAttStat('severe', value)} />
          <SwitchInput label="Shock" checked={attStats.shock} onChange={(value) => updateAttStat('shock', value)} />
          <StatInput label="Piercing x" type="number" value={attStats.piercing} onChange={(value) => updateAttStat('piercing', value)} min="0" />
          <StatInput label="Piercing Crits x" type="number" value={attStats.piercingCrits} onChange={(value) => updateAttStat('piercingCrits', value)} min="0" />
          <StatInput label="Devastating x" type="number" value={attStats.devastating} onChange={(value) => updateAttStat('devastating', value)} min="0" />
          <StatInput label="Wounds" type="number" value={attStats.wounds} onChange={(value) => updateAttStat('wounds', value)} min="1" />
        </Col>
        <Col md={6}>
          <h3>Defender</h3>
          <TeamSelector teams={attTeams} value={defTeam} onChange={setDefTeam} label="Team" />
          <OperatorSelector operators={defOperators} value={defOperator} onChange={setDefOperator} label="Operator" />
          <WeaponSelector weapons={defWeapons} value={defWeapon} onChange={setDefWeapon} label="Weapon" />
          <StatInput label="Attacks" type="number" value={defStats.attacks} onChange={(value) => updateDefStat('attacks', value)} min="0" />
          <StatInput label="Hit (WS)" type="number" value={defStats.hit} onChange={(value) => updateDefStat('hit', value)} min="2" max="6" />
          <StatInput label="Normal Damage" type="number" value={defStats.normalDmg} onChange={(value) => updateDefStat('normalDmg', value)} min="0" />
          <StatInput label="Critical Damage" type="number" value={defStats.critDmg} onChange={(value) => updateDefStat('critDmg', value)} min="0" />
          <StatInput label="Lethal (Crit on)" type="number" value={defStats.lethal} onChange={(value) => updateDefStat('lethal', value)} min="2" max="6" />
          <SwitchInput label="Balanced" checked={defStats.balanced} onChange={(value) => updateDefStat('balanced', value)} />
          <SwitchInput label="Ceaseless" checked={defStats.ceaseless} onChange={(value) => updateDefStat('ceaseless', value)} />
          <SwitchInput label="Relentless" checked={defStats.relentless} onChange={(value) => updateDefStat('relentless', value)} />
          <SwitchInput label="Rending" checked={defStats.rending} onChange={(value) => updateDefStat('rending', value)} />
          <SwitchInput label="Brutal" checked={defStats.brutal} onChange={(value) => updateDefStat('brutal', value)} />
          <SwitchInput label="Punishing" checked={defStats.punishing} onChange={(value) => updateDefStat('punishing', value)} />
          <SwitchInput label="Severe" checked={defStats.severe} onChange={(value) => updateDefStat('severe', value)} />
          <SwitchInput label="Shock" checked={defStats.shock} onChange={(value) => updateDefStat('shock', value)} />
          <StatInput label="Piercing x" type="number" value={defStats.piercing} onChange={(value) => updateDefStat('piercing', value)} min="0" />
          <StatInput label="Piercing Crits x" type="number" value={defStats.piercingCrits} onChange={(value) => updateDefStat('piercingCrits', value)} min="0" />
          <StatInput label="Devastating x" type="number" value={defStats.devastating} onChange={(value) => updateDefStat('devastating', value)} min="0" />
          <StatInput label="Wounds" type="number" value={defStats.wounds} onChange={(value) => updateDefStat('wounds', value)} min="1" />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="d-flex justify-content-center">
          <Button variant="primary" onClick={handleCalculate} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            Calculate
          </Button>
        </Col>
      </Row>
      {(selectionError || calcError) && <Alert variant="danger">{selectionError || calcError}</Alert>}
      {result && (
        <Row className="mt-3">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Results to Defender</Card.Title>
                <p>Average Damage: {result.avgDamageToDef.toFixed(2)}</p>
                <p>Average Remaining Wounds: {result.avgRemainingWoundsDef.toFixed(2)}</p>
                <p>Probability of Kill (damage &gt;= {defStats.wounds}): {result.probKillDef.toFixed(2)}%</p>
                <Bar
                  data={{
                    labels: Object.entries(result.dmgDistDef)
                      .filter(([dmg, count]) => (count / 10000) * 100 > 0)
                      .map(([dmg]) => dmg),
                    datasets: [{
                      label: 'Damage Probability',
                      data: Object.entries(result.dmgDistDef)
                        .filter(([dmg, count]) => (count / 10000) * 100 > 0)
                        .map(([dmg, count]) => (count / 10000) * 100),
                      backgroundColor: '#4e79a7',
                      borderColor: '#2e4977',
                      borderWidth: 1
                    }]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Damage Distribution to Defender'
                      },
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.parsed.y.toFixed(2)}%`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Damage'
                        }
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Probability (%)'
                        },
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Results to Attacker</Card.Title>
                <p>Average Damage: {result.avgDamageToAtt.toFixed(2)}</p>
                <p>Average Remaining Wounds: {result.avgRemainingWoundsAtt.toFixed(2)}</p>
                <p>Probability of Kill (damage &gt;= {attStats.wounds}): {result.probKillAtt.toFixed(2)}%</p>
                <Bar
                  data={{
                    labels: Object.entries(result.dmgDistAtt)
                      .filter(([dmg, count]) => (count / 10000) * 100 > 0)
                      .map(([dmg]) => dmg),
                    datasets: [{
                      label: 'Damage Probability',
                      data: Object.entries(result.dmgDistAtt)
                        .filter(([dmg, count]) => (count / 10000) * 100 > 0)
                        .map(([dmg, count]) => (count / 10000) * 100),
                      backgroundColor: '#e15759',
                      borderColor: '#b13739',
                      borderWidth: 1
                    }]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: 'Damage Distribution to Attacker'
                      },
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.parsed.y.toFixed(2)}%`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Damage'
                        }
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Probability (%)'
                        },
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Form>
  );
}

export default FightingForm;