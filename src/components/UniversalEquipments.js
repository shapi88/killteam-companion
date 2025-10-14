import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const UniversalEquipments = () => {
  const equipments = [
    { k: 'Frag Grenade', v: 'Explosive grenade: Range 6", Blast 2", Saturate. Use as an explosive grenade selection.' },
    { k: 'Krak Grenade', v: 'Explosive grenade: Range 6", Piercing 1, Saturate. Use as an explosive grenade selection.' },
    { k: 'Melta Bomb', v: 'High-damage explosive device used to damage heavy armour.' },
    { k: 'Photon Grenade', v: 'Special grenade with high anti-infantry effects.' },
    { k: 'Smoke Grenade', v: 'Utility grenade that creates an area of smoke obscuring targets.' },
    { k: 'Stun Grenade', v: 'Utility grenade that forces stun tests that may reduce APL.' },
    { k: 'Medi-pack', v: 'Healing equipment used to treat wounds during the battle.' },
    { k: 'Vox-caster', v: 'Communication device used for support and synergy effects.' },
    { k: 'Auspex', v: 'Sensor equipment used to detect hidden threats and grant bonuses.' },
    { k: 'Data-slate', v: 'Data device containing mission information and tactical readouts.' }
  ];

  const detailedRules = {
    '1x AMMO CACHE': `Set up to one marker wholly within your territory.
AMMO RESUPPLY 0AP
🟢 One Ammo Cache marker active operative controls is used this turning point.
🟢 Until next turning point, this operative shooting can re-roll one attack dice.
🔴 An operative cannot perform this action while within control range of an enemy operative, if that marker isn’t yours, or if it has been used this turning point.`,

    '1x COMMS DEVICE': `Set up to one marker wholly within your territory. While a friendly operative controls this marker, add 3” to the distance requirements of its SUPPORT rules that refer to friendly operatives. Cannot benefit from enemy Comms Devices.`,

    'EXPLOSIVE GRENADES': `Select 2 explosive grenades (2 frag, 2 krak, or 1 frag and 1 krak).
Frag grenade  A HT D WR
4 4+
2/4 Range 6", Blast 2", Saturate
Krak grenade 4 4+
4/5 Range 6", Piercing 1, Saturate`,

    '1x HEAVY BARRICADE': `Heavy. Set up wholly within 4” of your drop zone, on the killzone floor and more than 2” from equipment terrain features, access points and Accessible terrain.`,

    '2x LADDER': `Exposed terrain. Before the battle, you can set up any of them as follows:
• Wholly within your territory.
• Upright against terrain that is at least 2” tall.
• More than 2” from other equipment terrain features.
• More than 1” from doors and access points.
In addition, an operative can either move through ladders as if they aren’t there (but cannot finish on them), or climb them. Once per action, whenever an operative is climbing this terrain feature, treat the vertical distance as 1”.`,

    '2x LIGHT BARRICADE': `Light terrain, except the feet, which are Insignificant and Exposed. Set up wholly within your territory, on the killzone floor and more than 2” from other equipment terrain features, access points and Accessible terrain.`,

    '1x MINES': `Set up marker wholly within your territory and more than 2” from other markers, access points and Accessible terrain. The first time that marker is within an operative’s control range, remove marker, inflict D3+3 damage on that operative.`,

    '1x PORTABLE BARRICADE': `Light, Protective and Portable. Set up wholly within your territory, on killzone floor and >2” from equipment terrain features, access points and Accessible terrain.
Protective: While in cover from this, improve Save by 1 (to a maximum of 2+).
Portable: This terrain feature only provides cover while an operative is connected to it and if the shield is intervening (ignore its feet). Operatives connected to the inside of it can perform the following unique action during the battle.`,

    'MOVE WITH BARRICADE 1AP': `🟢 Same as Reposition action, except the active operative can move no more than its Move stat minus 2” and cannot climb, drop, jump or use any kill team rules that remove it and set it back up again (e.g. HEARTHKYN SALVAGER FLY, MANDRAKE SHADOW PASSAGE).
🟢 Before the operative moves, remove the portable barricade it’s connected to. After it moves, set up the portable barricade so it’s connected again, but cannot be set up within 2" of other equipment terrain features, access points or Accessible terrain. If this is not possible, the portable barricade is not set up again.
🔴 This action is treated as a Reposition action. An operative cannot perform this action while within control range of an enemy operative, or in the same activation in which it performed the Fall Back or Charge action.`,

    '1x RAZOR WIRE': `Exposed and Obstructive. Set up wholly within your territory, on the killzone floor and >2" from equipment terrain features, access points and Accessible terrain. Obstructive terrain: Whenever an operative would cross over this terrain feature within 1" of it, treat the distance as an additional 1”.`,

    'UTILITY GRENADES': `Select 2 utility grenades (2 smoke, 2 stun, or 1 smoke and 1 stun).`,

    'SMOKE GRENADE 1AP': `🟢 Place marker within 6” of operative. It must be visible to this operative, or on Vantage terrain of a terrain feature that’s visible to this operative. The marker creates an area of smoke 1” horizontally and unlimited height vertically up from it.
🟢 While an operative is wholly within an area of smoke, it’s obscured to operatives more than 2” from it, and vice versa. In addition, whenever an operative is shooting an enemy operative wholly within an area of smoke, ignore the Piercing weapon rule unless they are within 2” of each other.
🟢 In the Ready step of the next Strategy phase, roll a D3. Remove that Smoke Grenade marker after a number of activations equal to that D3 have been completed or at the end of the turning point (whichever comes first).
🔴 Cannot perform this action while within control range of an enemy operative.`,

    'STUN GRENADE 1AP': `🟢 Select one enemy operative visible and within 6” of this operative. That operative and each other operative within 1” of it takes a stun test. Roll one D6: If the result is 3+, subtract 1 from its APL stat until the end of its next activation.
🔴 Cannot perform this action while within control range of an enemy operative.`
  };

  return (
    <div>
      <h1>Universal Equipments</h1>
      <p>The following equipments are available to all operatives:</p>

      <Row xs={1} sm={2} md={3} className="g-3" style={{ marginBottom: '1rem' }}>
        {Object.entries(detailedRules).map(([k, v]) => (
          <Col key={k}>
            <Card bg="light" text="dark" className="h-100">
              <Card.Body>
                <Card.Title>{k}</Card.Title>
                <Card.Text style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.9rem' }}>{v}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

    </div>
  );
};

export default UniversalEquipments;