import React from 'react';

const GameSetup = () => {
  return (
    <div>
      <h1>Kill Team Game Setup</h1>
      <p>Follow these steps to set up your Kill Team game:</p>
      <ol>
        <li><strong>Determine Attacker and Defender:</strong> Players roll off to determine who is the Attacker and who is the Defender. The Attacker chooses the deployment zone.</li>
        <li><strong>Choose Deployment Zone:</strong> The Attacker selects one of the deployment zones on the battlefield.</li>
        <li><strong>Deploy Operatives:</strong> Alternate setting up equipment, starting with the player with initiative. Note this is item by item, not option by equipment option.
            <li>Alternate setting up 1/3 operatives (rounded up), starting with Initiative player.</li>
        </li>
        <li><strong>Determine Initiative:</strong> Players roll off to determine who has the initiative for the first Turning Point.</li>
        <li><strong>Begin the Game:</strong> The player with initiative starts the first Turning Point.</li>
      </ol>
    </div>
  );
};

export default GameSetup;