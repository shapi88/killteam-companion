import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Card, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function FightingForm({ teamData }) {
  const [attTeam, setAttTeam] = useState('');
  const [attOperator, setAttOperator] = useState('');
  const [attWeapon, setAttWeapon] = useState('');
  const [attAttacks, setAttAttacks] = useState(4);
  const [attHit, setAttHit] = useState(3);
  const [attNormalDmg, setAttNormalDmg] = useState(3);
  const [attCritDmg, setAttCritDmg] = useState(4);
  const [attLethal, setAttLethal] = useState(6);
  const [attBalanced, setAttBalanced] = useState(false);
  const [attCeaseless, setAttCeaseless] = useState(false);
  const [attRelentless, setAttRelentless] = useState(false);
  const [attRending, setAttRending] = useState(false);
  const [attBrutal, setAttBrutal] = useState(false);
  const [attPunishing, setAttPunishing] = useState(false);
  const [attSevere, setAttSevere] = useState(false);
  const [attShock, setAttShock] = useState(false);
  const [attPiercing, setAttPiercing] = useState(0);
  const [attPiercingCrits, setAttPiercingCrits] = useState(0);
  const [attDevastating, setAttDevastating] = useState(0);
  const [attWounds, setAttWounds] = useState(7);
  const [defTeam, setDefTeam] = useState('');
  const [defOperator, setDefOperator] = useState('');
  const [defWeapon, setDefWeapon] = useState('');
  const [defAttacks, setDefAttacks] = useState(3);
  const [defHit, setDefHit] = useState(4);
  const [defNormalDmg, setDefNormalDmg] = useState(3);
  const [defCritDmg, setDefCritDmg] = useState(4);
  const [defLethal, setDefLethal] = useState(6);
  const [defBalanced, setDefBalanced] = useState(false);
  const [defCeaseless, setDefCeaseless] = useState(false);
  const [defRelentless, setDefRelentless] = useState(false);
  const [defRending, setDefRending] = useState(false);
  const [defBrutal, setDefBrutal] = useState(false);
  const [defPunishing, setDefPunishing] = useState(false);
  const [defSevere, setDefSevere] = useState(false);
  const [defShock, setDefShock] = useState(false);
  const [defPiercing, setDefPiercing] = useState(0);
  const [defPiercingCrits, setDefPiercingCrits] = useState(0);
  const [defDevastating, setDefDevastating] = useState(0);
  const [defWounds, setDefWounds] = useState(7);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const attTeams = Object.keys(teamData);
  const attOperators = attTeam ? Object.keys(teamData[attTeam]?.operators || {}) : [];
  const attWeapons = attTeam && attOperator ? Object.keys(teamData[attTeam].operators[attOperator]?.melee || {}) : [];
  const defOperators = defTeam ? Object.keys(teamData[defTeam]?.operators || {}) : [];
  const defWeapons = defTeam && defOperator ? Object.keys(teamData[defTeam].operators[defOperator]?.melee || {}) : [];

  const preFillAtt = useCallback(() => {
    if (attTeam && attOperator) {
      const opData = teamData[attTeam].operators[attOperator];
      setAttWounds(opData.wounds || 7);
      const melee = opData.melee;
      if (attWeapon && melee[attWeapon]) {
        const weaponData = melee[attWeapon];
        setAttAttacks(weaponData.attacks || 4);
        setAttHit(weaponData.hit || 3);
        setAttNormalDmg(weaponData.normalDmg || 3);
        setAttCritDmg(weaponData.critDmg || 4);
        setAttLethal(weaponData.lethal || 6);
        setAttBalanced(weaponData.balanced || false);
        setAttCeaseless(weaponData.ceaseless || false);
        setAttRelentless(weaponData.relentless || false);
        setAttRending(weaponData.rending || false);
        setAttBrutal(weaponData.brutal || false);
        setAttPunishing(weaponData.punishing || false);
        setAttSevere(weaponData.severe || false);
        setAttShock(weaponData.shock || false);
        setAttPiercing(weaponData.piercing || 0);
        setAttPiercingCrits(weaponData.piercingCrits || 0);
        setAttDevastating(weaponData.devastating || 0);
      } else if (melee && Object.keys(melee).length > 0) {
        const defaultWeapon = Object.values(melee)[0];
        setAttAttacks(defaultWeapon.attacks || 4);
        setAttHit(defaultWeapon.hit || 3);
        setAttNormalDmg(defaultWeapon.normalDmg || 3);
        setAttCritDmg(defaultWeapon.critDmg || 4);
        setAttLethal(defaultWeapon.lethal || 6);
        setAttBalanced(defaultWeapon.balanced || false);
        setAttCeaseless(defaultWeapon.ceaseless || false);
        setAttRelentless(defaultWeapon.relentless || false);
        setAttRending(defaultWeapon.rending || false);
        setAttBrutal(defaultWeapon.brutal || false);
        setAttPunishing(defaultWeapon.punishing || false);
        setAttSevere(defaultWeapon.severe || false);
        setAttShock(defaultWeapon.shock || false);
        setAttPiercing(defaultWeapon.piercing || 0);
        setAttPiercingCrits(defaultWeapon.piercingCrits || 0);
        setAttDevastating(defaultWeapon.devastating || 0);
      }
    }
  }, [attTeam, attOperator, attWeapon, teamData]);

  const preFillDef = useCallback(() => {
    if (defTeam && defOperator) {
      const opData = teamData[defTeam].operators[defOperator];
      setDefWounds(opData.wounds || 7);
      const melee = opData.melee;
      if (Object.keys(melee).length === 0) {
        setDefAttacks(0);
        setDefNormalDmg(0);
        setDefCritDmg(0);
        setError('The selected defender has no melee weapon. Please select another operator or weapon.');
        return;
      }
      if (defWeapon && melee[defWeapon]) {
        const weaponData = melee[defWeapon];
        setDefAttacks(weaponData.attacks || 3);
        setDefHit(weaponData.hit || 4);
        setDefNormalDmg(weaponData.normalDmg || 3);
        setDefCritDmg(weaponData.critDmg || 4);
        setDefLethal(weaponData.lethal || 6);
        setDefBalanced(weaponData.balanced || false);
        setDefCeaseless(weaponData.ceaseless || false);
        setDefRelentless(weaponData.relentless || false);
        setDefRending(weaponData.rending || false);
        setDefBrutal(weaponData.brutal || false);
        setDefPunishing(weaponData.punishing || false);
        setDefSevere(weaponData.severe || false);
        setDefShock(weaponData.shock || false);
        setDefPiercing(weaponData.piercing || 0);
        setDefPiercingCrits(weaponData.piercingCrits || 0);
        setDefDevastating(weaponData.devastating || 0);
      } else {
        const defaultWeapon = Object.values(melee)[0];
        setDefAttacks(defaultWeapon.attacks || 3);
        setDefHit(defaultWeapon.hit || 4);
        setDefNormalDmg(defaultWeapon.normalDmg || 3);
        setDefCritDmg(defaultWeapon.critDmg || 4);
        setDefLethal(defaultWeapon.lethal || 6);
        setDefBalanced(defaultWeapon.balanced || false);
        setDefCeaseless(defaultWeapon.ceaseless || false);
        setDefRelentless(defaultWeapon.relentless || false);
        setDefRending(defaultWeapon.rending || false);
        setDefBrutal(defaultWeapon.brutal || false);
        setDefPunishing(defaultWeapon.punishing || false);
        setDefSevere(defaultWeapon.severe || false);
        setDefShock(defaultWeapon.shock || false);
        setDefPiercing(defaultWeapon.piercing || 0);
        setDefPiercingCrits(defaultWeapon.piercingCrits || 0);
        setDefDevastating(defaultWeapon.devastating || 0);
      }
    }
  }, [defTeam, defOperator, defWeapon, teamData]);

  useEffect(() => {
    preFillAtt();
  }, [preFillAtt]);

  useEffect(() => {
    preFillDef();
  }, [preFillDef]);

  const calculateOneWayDamage = (attAttacks, attHit, attNormalDmg, attCritDmg, attLethal, attBalanced, attCeaseless, attRelentless, attRending, attBrutal, attPunishing, attSevere, attShock, attPiercing, attPiercingCrits, attDevastating,
    defAttacks, defHit, defLethal, defBalanced, defCeaseless, defRelentless, defRending, defPunishing, defSevere) => {
    let attDice = Array.from({ length: attAttacks }, () => Math.floor(Math.random() * 6) + 1);

    // Attacker rerolls
    if (attCeaseless) {
      attDice = attDice.map(d => d === 1 ? Math.floor(Math.random() * 6) + 1 : d);
    }
    if (attRelentless) {
      attDice = attDice.map(d => d < attHit ? Math.floor(Math.random() * 6) + 1 : d);
    }
    if (attBalanced && attDice.some(d => d < attHit)) {
      const failIndex = attDice.findIndex(d => d < attHit);
      attDice[failIndex] = Math.floor(Math.random() * 6) + 1;
    }

    // Attacker successes
    let crits = attDice.filter(d => d >= attLethal).length;
    let normals = attDice.filter(d => d >= attHit && d < attLethal).length;

    // Attacker specials
    if (attPunishing && crits > 0 && attDice.some(d => d < attHit)) {
      normals++;
    }
    if (attSevere && crits === 0 && normals > 0) {
      normals--;
      crits++;
    }
    if (attRending && crits > 0 && normals > 0) {
      normals--;
      crits++;
    }

    // Effective defender dice
    let effectiveDefAttacks = defAttacks - attPiercing;
    if (crits > 0) effectiveDefAttacks -= attPiercingCrits;
    if (effectiveDefAttacks < 0) effectiveDefAttacks = 0;

    let defDice = Array.from({ length: effectiveDefAttacks }, () => Math.floor(Math.random() * 6) + 1);

    // Defender rerolls
    if (defCeaseless) {
      defDice = defDice.map(d => d === 1 ? Math.floor(Math.random() * 6) + 1 : d);
    }
    if (defRelentless) {
      defDice = defDice.map(d => d < defHit ? Math.floor(Math.random() * 6) + 1 : d);
    }
    if (defBalanced && defDice.some(d => d < defHit)) {
      const failIndex = defDice.findIndex(d => d < defHit);
      defDice[failIndex] = Math.floor(Math.random() * 6) + 1;
    }

    // Defender successes (parries)
    let critSaves = defDice.filter(d => d >= defLethal).length;
    let normalSaves = defDice.filter(d => d >= defHit && d < defLethal).length;

    // Defender specials for parries
    if (defPunishing && critSaves > 0 && defDice.some(d => d < defHit)) {
      normalSaves++;
    }
    if (defSevere && critSaves === 0 && normalSaves > 0) {
      normalSaves--;
      critSaves++;
    }
    if (defRending && critSaves > 0 && normalSaves > 0) {
      normalSaves--;
      critSaves++;
    }

    // Apply attacker strike specials to parries
    if (attBrutal) {
      normalSaves = 0;
    }
    if (attShock && crits > 0) {
      if (normalSaves > 0) {
        normalSaves--;
      } else if (critSaves > 0) {
        critSaves--;
      }
    }

    // Allocate parries optimally
    let remainingCrits = crits;
    let remainingNormals = normals;

    let block = Math.min(remainingCrits, critSaves);
    remainingCrits -= block;
    critSaves -= block;

    if (!attBrutal) {
      const pairs = Math.floor(normalSaves / 2);
      block = Math.min(remainingCrits, pairs);
      remainingCrits -= block;
      normalSaves -= 2 * block;
    }

    block = Math.min(remainingNormals, critSaves);
    remainingNormals -= block;
    critSaves -= block;

    block = Math.min(remainingNormals, normalSaves);
    remainingNormals -= block;

    // Final damage
    return remainingCrits * attCritDmg + remainingNormals * attNormalDmg + attDevastating * remainingCrits;
  };

  const calculateFighting = useCallback(() => {
    setError('');
    if (attAttacks < 1 || attHit < 2 || attHit > 6 || attNormalDmg < 1 || attCritDmg < 1 || defAttacks < 1 || defHit < 2 || defHit > 6 || attWounds < 1 || defWounds < 1 || defNormalDmg < 1 || defCritDmg < 1) {
      setError('Please check input values are valid.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const N = 10000;
      let totalDamageToDef = 0;
      let killsDef = 0;
      let dmgDistDef = {};
      let totalDamageToAtt = 0;
      let killsAtt = 0;
      let dmgDistAtt = {};
      let totalRemainingWoundsDef = 0;
      let totalRemainingWoundsAtt = 0;

      for (let sim = 0; sim < N; sim++) {
        // Damage to defender (attacker striking, defender parrying)
        const damageToDef = calculateOneWayDamage(
          attAttacks, attHit, attNormalDmg, attCritDmg, attLethal, attBalanced, attCeaseless, attRelentless, attRending, attBrutal, attPunishing, attSevere, attShock, attPiercing, attPiercingCrits, attDevastating,
          defAttacks, defHit, defLethal, defBalanced, defCeaseless, defRelentless, defRending, defPunishing, defSevere
        );
        totalDamageToDef += damageToDef;
        if (damageToDef >= defWounds) killsDef++;
        dmgDistDef[damageToDef] = (dmgDistDef[damageToDef] || 0) + 1;
        totalRemainingWoundsDef += Math.max(0, defWounds - damageToDef);

        // Damage to attacker (defender striking, attacker parrying)
        const damageToAtt = calculateOneWayDamage(
          defAttacks, defHit, defNormalDmg, defCritDmg, defLethal, defBalanced, defCeaseless, defRelentless, defRending, defBrutal, defPunishing, defSevere, defShock, defPiercing, defPiercingCrits, defDevastating,
          attAttacks, attHit, attLethal, attBalanced, attCeaseless, attRelentless, attRending, attPunishing, attSevere
        );
        totalDamageToAtt += damageToAtt;
        if (damageToAtt >= attWounds) killsAtt++;
        dmgDistAtt[damageToAtt] = (dmgDistAtt[damageToAtt] || 0) + 1;
        totalRemainingWoundsAtt += Math.max(0, attWounds - damageToAtt);
      }

      const avgDamageToDef = totalDamageToDef / N;
      const probKillDef = (killsDef / N) * 100;
      const avgRemainingWoundsDef = totalRemainingWoundsDef / N;
      const avgDamageToAtt = totalDamageToAtt / N;
      const probKillAtt = (killsAtt / N) * 100;
      const avgRemainingWoundsAtt = totalRemainingWoundsAtt / N;

      setResult({ avgDamageToDef, probKillDef, dmgDistDef, avgDamageToAtt, probKillAtt, dmgDistAtt, avgRemainingWoundsDef, avgRemainingWoundsAtt });
      setLoading(false);
    }, 0);
  }, [attAttacks, attHit, attNormalDmg, attCritDmg, attLethal, attBalanced, attCeaseless, attRelentless, attRending, attBrutal, attPunishing, attSevere, attShock, attPiercing, attPiercingCrits, attDevastating, attWounds,
    defAttacks, defHit, defNormalDmg, defCritDmg, defLethal, defBalanced, defCeaseless, defRelentless, defRending, defBrutal, defPunishing, defSevere, defShock, defPiercing, defPiercingCrits, defDevastating, defWounds]);

  return (
    <Form>
      <Row>
        <Col md={6}>
          <h3>Attacker</h3>
          <Form.Group className="mb-3">
            <Form.Label>Team:</Form.Label>
            <Form.Select value={attTeam} onChange={(e) => setAttTeam(e.target.value)}>
              <option value="">Select a team</option>
              {attTeams.map(team => <option key={team} value={team}>{team}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Operator:</Form.Label>
            <Form.Select value={attOperator} onChange={(e) => setAttOperator(e.target.value)}>
              <option value="">Select an operator</option>
              {attOperators.map(op => <option key={op} value={op}>{op}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Weapon:</Form.Label>
            <Form.Select value={attWeapon} onChange={(e) => setAttWeapon(e.target.value)}>
              <option value="">Select a weapon</option>
              {attWeapons.map(w => <option key={w} value={w}>{w}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Number of Attacks (A):</Form.Label>
            <Form.Control type="number" value={attAttacks} onChange={(e) => setAttAttacks(parseInt(e.target.value) || 4)} min="1" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hits on (e.g., 3 for 3+):</Form.Label>
            <Form.Control type="number" value={attHit} onChange={(e) => setAttHit(parseInt(e.target.value) || 3)} min="2" max="6" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Normal Damage:</Form.Label>
            <Form.Control type="number" value={attNormalDmg} onChange={(e) => setAttNormalDmg(parseInt(e.target.value) || 3)} min="1" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Critical Damage:</Form.Label>
            <Form.Control type="number" value={attCritDmg} onChange={(e) => setAttCritDmg(parseInt(e.target.value) || 4)} min="1" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Lethal:</Form.Label>
            <Form.Select value={attLethal} onChange={(e) => setAttLethal(parseInt(e.target.value) || 6)}>
              <option value="6">None</option>
              <option value="5">5+</option>
              <option value="4">4+</option>
              <option value="3">3+</option>
            </Form.Select>
          </Form.Group>
          <Form.Check type="switch" label="Balanced" checked={attBalanced} onChange={(e) => setAttBalanced(e.target.checked)} />
          <Form.Check type="switch" label="Ceaseless" checked={attCeaseless} onChange={(e) => setAttCeaseless(e.target.checked)} />
          <Form.Check type="switch" label="Relentless" checked={attRelentless} onChange={(e) => setAttRelentless(e.target.checked)} />
          <Form.Check type="switch" label="Rending" checked={attRending} onChange={(e) => setAttRending(e.target.checked)} />
          <Form.Check type="switch" label="Brutal" checked={attBrutal} onChange={(e) => setAttBrutal(e.target.checked)} />
          <Form.Check type="switch" label="Punishing" checked={attPunishing} onChange={(e) => setAttPunishing(e.target.checked)} />
          <Form.Check type="switch" label="Severe" checked={attSevere} onChange={(e) => setAttSevere(e.target.checked)} />
          <Form.Check type="switch" label="Shock" checked={attShock} onChange={(e) => setAttShock(e.target.checked)} />
          <Form.Group className="mb-3">
            <Form.Label>Piercing x:</Form.Label>
            <Form.Control type="number" value={attPiercing} onChange={(e) => setAttPiercing(parseInt(e.target.value) || 0)} min="0" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Piercing Crits x:</Form.Label>
            <Form.Control type="number" value={attPiercingCrits} onChange={(e) => setAttPiercingCrits(parseInt(e.target.value) || 0)} min="0" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Devastating x:</Form.Label>
            <Form.Control type="number" value={attDevastating} onChange={(e) => setAttDevastating(parseInt(e.target.value) || 0)} min="0" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Wounds:</Form.Label>
            <Form.Control type="number" value={attWounds} onChange={(e) => setAttWounds(parseInt(e.target.value) || 7)} min="1" />
          </Form.Group>
        </Col>
        <Col md={6}>
          <h3>Target (Defender)</h3>
          <Form.Group className="mb-3">
            <Form.Label>Team:</Form.Label>
            <Form.Select value={defTeam} onChange={(e) => setDefTeam(e.target.value)}>
              <option value="">Select a team</option>
              {attTeams.map(team => <option key={team} value={team}>{team}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Operator:</Form.Label>
            <Form.Select value={defOperator} onChange={(e) => setDefOperator(e.target.value)}>
              <option value="">Select an operator</option>
              {defOperators.map(op => <option key={op} value={op}>{op}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Weapon:</Form.Label>
            <Form.Select value={defWeapon} onChange={(e) => setDefWeapon(e.target.value)}>
              <option value="">Select a weapon</option>
              {defWeapons.map(w => <option key={w} value={w}>{w}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Number of Attacks (A):</Form.Label>
            <Form.Control type="number" value={defAttacks} onChange={(e) => setDefAttacks(parseInt(e.target.value) || 3)} min="1" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hits on (e.g., 4 for 4+):</Form.Label>
            <Form.Control type="number" value={defHit} onChange={(e) => setDefHit(parseInt(e.target.value) || 4)} min="2" max="6" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Normal Damage:</Form.Label>
            <Form.Control type="number" value={defNormalDmg} onChange={(e) => setDefNormalDmg(parseInt(e.target.value) || 3)} min="1" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Critical Damage:</Form.Label>
            <Form.Control type="number" value={defCritDmg} onChange={(e) => setDefCritDmg(parseInt(e.target.value) || 4)} min="1" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Lethal:</Form.Label>
            <Form.Select value={defLethal} onChange={(e) => setDefLethal(parseInt(e.target.value) || 6)}>
              <option value="6">None</option>
              <option value="5">5+</option>
              <option value="4">4+</option>
              <option value="3">3+</option>
            </Form.Select>
          </Form.Group>
          <Form.Check type="switch" label="Balanced" checked={defBalanced} onChange={(e) => setDefBalanced(e.target.checked)} />
          <Form.Check type="switch" label="Ceaseless" checked={defCeaseless} onChange={(e) => setDefCeaseless(e.target.checked)} />
          <Form.Check type="switch" label="Relentless" checked={defRelentless} onChange={(e) => setDefRelentless(e.target.checked)} />
          <Form.Check type="switch" label="Rending" checked={defRending} onChange={(e) => setDefRending(e.target.checked)} />
          <Form.Check type="switch" label="Brutal" checked={defBrutal} onChange={(e) => setDefBrutal(e.target.checked)} />
          <Form.Check type="switch" label="Punishing" checked={defPunishing} onChange={(e) => setDefPunishing(e.target.checked)} />
          <Form.Check type="switch" label="Severe" checked={defSevere} onChange={(e) => setDefSevere(e.target.checked)} />
          <Form.Check type="switch" label="Shock" checked={defShock} onChange={(e) => setDefShock(e.target.checked)} />
          <Form.Group className="mb-3">
            <Form.Label>Piercing x:</Form.Label>
            <Form.Control type="number" value={defPiercing} onChange={(e) => setDefPiercing(parseInt(e.target.value) || 0)} min="0" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Piercing Crits x:</Form.Label>
            <Form.Control type="number" value={defPiercingCrits} onChange={(e) => setDefPiercingCrits(parseInt(e.target.value) || 0)} min="0" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Devastating x:</Form.Label>
            <Form.Control type="number" value={defDevastating} onChange={(e) => setDefDevastating(parseInt(e.target.value) || 0)} min="0" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Wounds:</Form.Label>
            <Form.Control type="number" value={defWounds} onChange={(e) => setDefWounds(parseInt(e.target.value) || 7)} min="1" />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="d-flex justify-content-center">
          <Button variant="primary" onClick={calculateFighting} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            Calculate
          </Button>
        </Col>
      </Row>
      {error && <Alert variant="danger">{error}</Alert>}
      {result && (
        <Row className="mt-3">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Results to Target (Defender)</Card.Title>
                <p>Average Damage: {result.avgDamageToDef.toFixed(2)}</p>
                <p>Average Remaining Wounds: {result.avgRemainingWoundsDef.toFixed(2)}</p>
                <p>Probability of Kill (damage &gt;= {defWounds}): {result.probKillDef.toFixed(2)}%</p>
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
                <p>Probability of Kill (damage &gt;= {attWounds}): {result.probKillAtt.toFixed(2)}%</p>
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
