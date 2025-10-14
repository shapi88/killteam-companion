import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Card, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function ShootingForm({ teamData }) {
  const [shooterTeam, setShooterTeam] = useState('');
  const [shooterOperator, setShooterOperator] = useState('');
  const [shooterWeapon, setShooterWeapon] = useState('');
  const [shooterAttacks, setShooterAttacks] = useState(4);
  const [shooterBs, setShooterBs] = useState(3);
  const [shooterNormalDmg, setShooterNormalDmg] = useState(3);
  const [shooterCritDmg, setShooterCritDmg] = useState(4);
  const [shooterLethal, setShooterLethal] = useState(6);
  const [shooterBalanced, setShooterBalanced] = useState(false);
  const [shooterCeaseless, setShooterCeaseless] = useState(false);
  const [shooterRelentless, setShooterRelentless] = useState(false);
  const [shooterRending, setShooterRending] = useState(false);
  const [shooterPunishing, setShooterPunishing] = useState(false);
  const [shooterSevere, setShooterSevere] = useState(false);
  const [shooterShock, setShooterShock] = useState(false);
  const [shooterHot, setShooterHot] = useState(false);
  const [shooterPiercing, setShooterPiercing] = useState(0);
  const [shooterPiercingCrits, setShooterPiercingCrits] = useState(0);
  const [shooterDevastating, setShooterDevastating] = useState(0);
  const [shooterMw, setShooterMw] = useState(0);
  const [targetTeam, setTargetTeam] = useState('');
  const [targetOperator, setTargetOperator] = useState('');
  const [targetWounds, setTargetWounds] = useState(7);
  const [targetDf, setTargetDf] = useState(3);
  const [targetSv, setTargetSv] = useState(3);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shooterTeams = Object.keys(teamData);
  const shooterOperators = shooterTeam ? Object.keys(teamData[shooterTeam]?.operators || {}) : [];
  const shooterWeapons = shooterTeam && shooterOperator ? Object.keys(teamData[shooterTeam].operators[shooterOperator]?.ranged || {}) : [];
  const targetOperators = targetTeam ? Object.keys(teamData[targetTeam]?.operators || {}) : [];

  const preFillShooter = useCallback(() => {
    if (shooterTeam && shooterOperator) {
      const opData = teamData[shooterTeam].operators[shooterOperator];
      const ranged = opData.ranged;
      if (shooterWeapon && ranged[shooterWeapon]) {
        const weaponData = ranged[shooterWeapon];
        setShooterAttacks(weaponData.attacks || 4);
        setShooterBs(weaponData.bs || 3);
        setShooterNormalDmg(weaponData.normalDmg || 3);
        setShooterCritDmg(weaponData.critDmg || 4);
        setShooterLethal(weaponData.lethal || 6);
        setShooterBalanced(weaponData.balanced || false);
        setShooterCeaseless(weaponData.ceaseless || false);
        setShooterRelentless(weaponData.relentless || false);
        setShooterRending(weaponData.rending || false);
        setShooterPunishing(weaponData.punishing || false);
        setShooterSevere(weaponData.severe || false);
        setShooterShock(weaponData.shock || false);
        setShooterHot(weaponData.hot || false);
        setShooterPiercing(weaponData.piercing || 0);
        setShooterPiercingCrits(weaponData.piercingCrits || 0);
        setShooterDevastating(weaponData.devastating || 0);
        setShooterMw(weaponData.mw || 0);
      } else if (ranged && Object.keys(ranged).length > 0) {
        const defaultWeapon = Object.values(ranged)[0];
        setShooterAttacks(defaultWeapon.attacks || 4);
        setShooterBs(defaultWeapon.bs || 3);
        setShooterNormalDmg(defaultWeapon.normalDmg || 3);
        setShooterCritDmg(defaultWeapon.critDmg || 4);
        setShooterLethal(defaultWeapon.lethal || 6);
        setShooterBalanced(defaultWeapon.balanced || false);
        setShooterCeaseless(defaultWeapon.ceaseless || false);
        setShooterRelentless(defaultWeapon.relentless || false);
        setShooterRending(defaultWeapon.rending || false);
        setShooterPunishing(defaultWeapon.punishing || false);
        setShooterSevere(defaultWeapon.severe || false);
        setShooterShock(defaultWeapon.shock || false);
        setShooterHot(defaultWeapon.hot || false);
        setShooterPiercing(defaultWeapon.piercing || 0);
        setShooterPiercingCrits(defaultWeapon.piercingCrits || 0);
        setShooterDevastating(defaultWeapon.devastating || 0);
        setShooterMw(defaultWeapon.mw || 0);
      }
    }
  }, [shooterTeam, shooterOperator, shooterWeapon, teamData]);

  const preFillTarget = useCallback(() => {
    if (targetTeam && targetOperator) {
      const opData = teamData[targetTeam].operators[targetOperator];
      setTargetWounds(opData.wounds || 7);
      setTargetDf(opData.df || 3);
      setTargetSv(opData.sv || 3);
    }
  }, [targetTeam, targetOperator, teamData]);

  useEffect(() => {
    preFillShooter();
  }, [preFillShooter]);

  useEffect(() => {
    preFillTarget();
  }, [preFillTarget]);

  const calculateOneWayDamage = (
    attacks, bs, normalDmg, critDmg, lethal, balanced, ceaseless, relentless, rending, punishing, severe, shock, hot, piercing, piercingCrits, devastating, mw,
    df, sv
  ) => {
    let attDice = Array.from({ length: attacks }, () => Math.floor(Math.random() * 6) + 1);

    // Shooter rerolls
    if (hot && attDice.some(d => d === 1)) {
      attDice = Array.from({ length: attacks }, () => Math.floor(Math.random() * 6) + 1);
    }
    if (ceaseless) {
      attDice = attDice.map(d => d === 1 ? Math.floor(Math.random() * 6) + 1 : d);
    }
    if (relentless) {
      attDice = attDice.map(d => d < bs ? Math.floor(Math.random() * 6) + 1 : d);
    }
    if (balanced && attDice.some(d => d < bs)) {
      const failIndex = attDice.findIndex(d => d < bs);
      attDice[failIndex] = Math.floor(Math.random() * 6) + 1;
    }

    // Shooter successes
    let crits = attDice.filter(d => d >= lethal).length;
    let normals = attDice.filter(d => d >= bs && d < lethal).length;

    // Shooter specials
    if (punishing && crits > 0 && attDice.some(d => d < bs)) {
      normals++;
    }
    if (severe && crits === 0 && normals > 0) {
      normals--;
      crits++;
    }
    if (rending && crits > 0 && normals > 0) {
      normals--;
      crits++;
    }

    // Effective target save dice
    let effectiveDf = df - piercing;
    if (crits > 0) effectiveDf -= piercingCrits;
    if (effectiveDf < 0) effectiveDf = 0;

    let saveDice = Array.from({ length: effectiveDf }, () => Math.floor(Math.random() * 6) + 1);

    // Target saves
    let saves = saveDice.filter(d => d >= sv).length;

    // Apply shooter specials to saves
    if (shock && crits > 0 && saves > 0) {
      saves--;
    }

    // Allocate saves (only block normal hits unless apx = 0)
    let remainingCrits = crits;
    let remainingNormals = normals;

    if (piercing === 0) {
      let block = Math.min(remainingCrits, saves);
      remainingCrits -= block;
      saves -= block;
    }

    let block = Math.min(remainingNormals, saves);
    remainingNormals -= block;

    // Final damage
    return remainingCrits * critDmg + remainingNormals * normalDmg + crits * (devastating + mw);
  };

  const calculateShooting = useCallback(() => {
    setError('');
    if (shooterAttacks < 1 || shooterBs < 2 || shooterBs > 6 || shooterNormalDmg < 1 || shooterCritDmg < 1 || targetWounds < 1 || targetDf < 0 || targetSv < 2 || targetSv > 6) {
      setError('Please check input values are valid.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const N = 10000;
      let totalDamage = 0;
      let kills = 0;
      let dmgDist = {};
      let totalRemainingWounds = 0;

      for (let sim = 0; sim < N; sim++) {
        const damage = calculateOneWayDamage(
          shooterAttacks, shooterBs, shooterNormalDmg, shooterCritDmg, shooterLethal, shooterBalanced, shooterCeaseless, shooterRelentless, shooterRending, shooterPunishing, shooterSevere, shooterShock, shooterHot, shooterPiercing, shooterPiercingCrits, shooterDevastating, shooterMw,
          targetDf, targetSv
        );
        totalDamage += damage;
        if (damage >= targetWounds) kills++;
        dmgDist[damage] = (dmgDist[damage] || 0) + 1;
        totalRemainingWounds += Math.max(0, targetWounds - damage);
      }

      const avgDamage = totalDamage / N;
      const probKill = (kills / N) * 100;
      const avgRemainingWounds = totalRemainingWounds / N;

      setResult({ avgDamage, probKill, dmgDist, avgRemainingWounds });
      setLoading(false);
    }, 0);
  }, [shooterAttacks, shooterBs, shooterNormalDmg, shooterCritDmg, shooterLethal, shooterBalanced, shooterCeaseless, shooterRelentless, shooterRending, shooterPunishing, shooterSevere, shooterShock, shooterHot, shooterPiercing, shooterPiercingCrits, shooterDevastating, shooterMw, targetWounds, targetDf, targetSv]);

  return (
    <Form>
      <Row>
        <Col md={6}>
          <h3>Shooter</h3>
          <Form.Group className="mb-3">
            <Form.Label>Team:</Form.Label>
            <Form.Select value={shooterTeam} onChange={(e) => setShooterTeam(e.target.value)}>
              <option value="">Select a team</option>
              {shooterTeams.map(team => <option key={team} value={team}>{team}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Operator:</Form.Label>
            <Form.Select value={shooterOperator} onChange={(e) => setShooterOperator(e.target.value)}>
              <option value="">Select an operator</option>
              {shooterOperators.map(op => <option key={op} value={op}>{op}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Weapon:</Form.Label>
            <Form.Select value={shooterWeapon} onChange={(e) => setShooterWeapon(e.target.value)}>
              <option value="">Select a weapon</option>
              {shooterWeapons.map(w => <option key={w} value={w}>{w}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Number of Attacks (A):</Form.Label>
            <Form.Control type="number" value={shooterAttacks} onChange={(e) => setShooterAttacks(parseInt(e.target.value) || 4)} min="1" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ballistic Skill (e.g., 3 for 3+):</Form.Label>
            <Form.Control type="number" value={shooterBs} onChange={(e) => setShooterBs(parseInt(e.target.value) || 3)} min="2" max="6" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Normal Damage:</Form.Label>
            <Form.Control type="number" value={shooterNormalDmg} onChange={(e) => setShooterNormalDmg(parseInt(e.target.value) || 3)} min="1" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Critical Damage:</Form.Label>
            <Form.Control type="number" value={shooterCritDmg} onChange={(e) => setShooterCritDmg(parseInt(e.target.value) || 4)} min="1" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Lethal:</Form.Label>
            <Form.Select value={shooterLethal} onChange={(e) => setShooterLethal(parseInt(e.target.value) || 6)}>
              <option value="6">None</option>
              <option value="5">5+</option>
              <option value="4">4+</option>
              <option value="3">3+</option>
            </Form.Select>
          </Form.Group>
          <Form.Check type="switch" label="Balanced" checked={shooterBalanced} onChange={(e) => setShooterBalanced(e.target.checked)} />
          <Form.Check type="switch" label="Ceaseless" checked={shooterCeaseless} onChange={(e) => setShooterCeaseless(e.target.checked)} />
          <Form.Check type="switch" label="Relentless" checked={shooterRelentless} onChange={(e) => setShooterRelentless(e.target.checked)} />
          <Form.Check type="switch" label="Rending" checked={shooterRending} onChange={(e) => setShooterRending(e.target.checked)} />
          <Form.Check type="switch" label="Punishing" checked={shooterPunishing} onChange={(e) => setShooterPunishing(e.target.checked)} />
          <Form.Check type="switch" label="Severe" checked={shooterSevere} onChange={(e) => setShooterSevere(e.target.checked)} />
          <Form.Check type="switch" label="Shock" checked={shooterShock} onChange={(e) => setShooterShock(e.target.checked)} />
          <Form.Check type="switch" label="Hot" checked={shooterHot} onChange={(e) => setShooterHot(e.target.checked)} />
          <Form.Group className="mb-3">
            <Form.Label>Piercing x:</Form.Label>
            <Form.Control type="number" value={shooterPiercing} onChange={(e) => setShooterPiercing(parseInt(e.target.value) || 0)} min="0" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Piercing Crits x:</Form.Label>
            <Form.Control type="number" value={shooterPiercingCrits} onChange={(e) => setShooterPiercingCrits(parseInt(e.target.value) || 0)} min="0" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Devastating x:</Form.Label>
            <Form.Control type="number" value={shooterDevastating} onChange={(e) => setShooterDevastating(parseInt(e.target.value) || 0)} min="0" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mortal Wounds x:</Form.Label>
            <Form.Control type="number" value={shooterMw} onChange={(e) => setShooterMw(parseInt(e.target.value) || 0)} min="0" />
          </Form.Group>
        </Col>
        <Col md={6}>
          <h3>Target</h3>
          <Form.Group className="mb-3">
            <Form.Label>Team:</Form.Label>
            <Form.Select value={targetTeam} onChange={(e) => setTargetTeam(e.target.value)}>
              <option value="">Select a team</option>
              {shooterTeams.map(team => <option key={team} value={team}>{team}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Operator:</Form.Label>
            <Form.Select value={targetOperator} onChange={(e) => setTargetOperator(e.target.value)}>
              <option value="">Select an operator</option>
              {targetOperators.map(op => <option key={op} value={op}>{op}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Wounds:</Form.Label>
            <Form.Control type="number" value={targetWounds} onChange={(e) => setTargetWounds(parseInt(e.target.value) || 7)} min="1" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Defense (DF):</Form.Label>
            <Form.Control type="number" value={targetDf} onChange={(e) => setTargetDf(parseInt(e.target.value) || 3)} min="0" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Save (e.g., 3 for 3+):</Form.Label>
            <Form.Control type="number" value={targetSv} onChange={(e) => setTargetSv(parseInt(e.target.value) || 3)} min="2" max="6" />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="d-flex justify-content-center">
          <Button variant="primary" onClick={calculateShooting} disabled={loading}>
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
                <p>Probability of Kill (damage &gt;= {targetWounds}): {result.probKill.toFixed(2)}%</p>
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
    </Form>
  );
}

export default ShootingForm;