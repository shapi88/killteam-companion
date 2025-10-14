import React, { useState } from 'react';
import { Container, Row, Col, Tabs, Tab, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { useTeamSelection } from '../hooks/useTeamSelection';
import { useDamageCalculation } from '../hooks/useDamageCalculation';
import { SHOOTER_DEFAULTS, TARGET_DEFAULTS } from '../models/Stats';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import FightingForm from './FightingForm';
import { TeamSelector } from './commons/TeamSelector';
import { OperatorSelector } from './commons/OperatorSelector';
import { WeaponSelector } from './commons/WeaponSelector';
import { StatInput } from './commons/StatInput';
import { SwitchInput } from './commons/SwitchInput';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

/**
 * ShootingForm component for calculating shooting phase outcomes.
 * @param {Object} props - Component props
 * @param {Object} props.teamData - Team data from JSON
 */
function ShootingForm({ teamData }) {
  const [activeTab, setActiveTab] = useState('shooting');

  const {
    team: shooterTeam,
    operator: shooterOperator,
    weapon: shooterWeapon,
    stats: shooterStats,
    setTeam: setShooterTeam,
    setOperator: setShooterOperator,
    setWeapon: setShooterWeapon,
    updateStat: updateShooterStat,
    teams: shooterTeams,
    operators: shooterOperators,
    weapons: shooterWeapons,
  } = useTeamSelection(teamData, 'ranged', SHOOTER_DEFAULTS);

  const {
    team: targetTeam,
    operator: targetOperator,
    stats: targetStats,
    setTeam: setTargetTeam,
    setOperator: setTargetOperator,
    updateStat: updateTargetStat,
    operators: targetOperators,
  } = useTeamSelection(teamData, null, TARGET_DEFAULTS);

  const { result, loading, error, calculate } = useDamageCalculation('shooting');

  const handleCalculate = () => {
    calculate({ shooterStats, targetStats });
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Kill Team 2024 Probability Calculator</h1>
      <p className="text-muted text-center mb-4">
        Select the phase and configure the attacker and target. Calculations are based on Monte Carlo simulations (10,000 iterations for faster performance). Based on the July 2024 lite rules.
      </p>
      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
        <Tab eventKey="shooting" title="Shooting">
          <Row>
            <Col md={6}>
              <h3>Shooter</h3>
              <TeamSelector teams={shooterTeams} value={shooterTeam} onChange={setShooterTeam} label="Team" />
              <OperatorSelector operators={shooterOperators} value={shooterOperator} onChange={setShooterOperator} label="Operator" />
              <WeaponSelector weapons={shooterWeapons} value={shooterWeapon} onChange={setShooterWeapon} label="Weapon" />
              <StatInput label="Attacks" type="number" value={shooterStats.attacks} onChange={(value) => updateShooterStat('attacks', value)} min="0" />
              <StatInput label="Ballistic Skill (BS)" type="number" value={shooterStats.bs} onChange={(value) => updateShooterStat('bs', value)} min="2" max="6" />
              <StatInput label="Normal Damage" type="number" value={shooterStats.normalDmg} onChange={(value) => updateShooterStat('normalDmg', value)} min="0" />
              <StatInput label="Critical Damage" type="number" value={shooterStats.critDmg} onChange={(value) => updateShooterStat('critDmg', value)} min="0" />
              <StatInput label="Lethal (Crit on)" type="number" value={shooterStats.lethal} onChange={(value) => updateShooterStat('lethal', value)} min="2" max="6" />
              <SwitchInput label="Balanced" checked={shooterStats.balanced} onChange={(value) => updateShooterStat('balanced', value)} />
              <SwitchInput label="Ceaseless" checked={shooterStats.ceaseless} onChange={(value) => updateShooterStat('ceaseless', value)} />
              <SwitchInput label="Relentless" checked={shooterStats.relentless} onChange={(value) => updateShooterStat('relentless', value)} />
              <SwitchInput label="Rending" checked={shooterStats.rending} onChange={(value) => updateShooterStat('rending', value)} />
              <SwitchInput label="Punishing" checked={shooterStats.punishing} onChange={(value) => updateShooterStat('punishing', value)} />
              <SwitchInput label="Severe" checked={shooterStats.severe} onChange={(value) => updateShooterStat('severe', value)} />
              <SwitchInput label="Shock" checked={shooterStats.shock} onChange={(value) => updateShooterStat('shock', value)} />
              <SwitchInput label="Hot" checked={shooterStats.hot} onChange={(value) => updateShooterStat('hot', value)} />
              <StatInput label="Piercing x" type="number" value={shooterStats.piercing} onChange={(value) => updateShooterStat('piercing', value)} min="0" />
              <StatInput label="Piercing Crits x" type="number" value={shooterStats.piercingCrits} onChange={(value) => updateShooterStat('piercingCrits', value)} min="0" />
              <StatInput label="Devastating x" type="number" value={shooterStats.devastating} onChange={(value) => updateShooterStat('devastating', value)} min="0" />
              <StatInput label="Mortal Wounds x" type="number" value={shooterStats.mw} onChange={(value) => updateShooterStat('mw', value)} min="0" />
            </Col>
            <Col md={6}>
              <h3>Target</h3>
              <TeamSelector teams={shooterTeams} value={targetTeam} onChange={setTargetTeam} label="Team" />
              <OperatorSelector operators={targetOperators} value={targetOperator} onChange={setTargetOperator} label="Operator" />
              <StatInput label="Wounds" type="number" value={targetStats.wounds} onChange={(value) => updateTargetStat('wounds', value)} min="1" />
              <StatInput label="Defense (DF)" type="number" value={targetStats.df} onChange={(value) => updateTargetStat('df', value)} min="0" />
              <StatInput label="Save (e.g., 3 for 3+)" type="number" value={targetStats.sv} onChange={(value) => updateTargetStat('sv', value)} min="2" max="6" />
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
          {error && <Alert variant="danger">{error}</Alert>}
          {result && (
            <Row className="mt-3">
              <Col md={12}>
                <Card>
                  <Card.Body>
                    <Card.Title>Results to Target</Card.Title>
                    <p>Average Damage: {result.avgDamage.toFixed(2)}</p>
                    <p>Average Remaining Wounds: {result.avgRemainingWounds.toFixed(2)}</p>
                    <p>Probability of Kill (damage &gt;= {targetStats.wounds}): {result.probKill.toFixed(2)}%</p>
                    <Bar
                      data={{
                        labels: Object.entries(result.dmgDist)
                          .filter(([dmg, count]) => (count / 10000) * 100 > 0)
                          .map(([dmg]) => dmg),
                        datasets: [{
                          label: 'Damage Probability',
                          data: Object.entries(result.dmgDist)
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
                            text: 'Damage Distribution to Target'
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
        </Tab>
        <Tab eventKey="fighting" title="Fighting">
          <FightingForm teamData={teamData} />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default ShootingForm;