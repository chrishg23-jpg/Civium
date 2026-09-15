import React, { useState } from 'react';
import { getNeighbourhood, joinNeighbourhood } from '../api/client';
import { Panel } from './ui/Panel';

export function NeighbourhoodDashboard() {
  const [id, setId] = useState("");
  const [householdId, setHouseholdId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [joinResult, setJoinResult] = useState<any>(null);

  async function handleFetch() {
    const neighbourhood = await getNeighbourhood(id);
    setResult(neighbourhood);
  }

  async function handleJoin() {
    const updated = await joinNeighbourhood(householdId, id);
    setJoinResult(updated);
  }

  return (
    <Panel title="Neighbourhoods">
      <h3>Load Neighbourhood</h3>
      <input
        placeholder="Neighbourhood ID"
        value={id}
        onChange={e => setId(e.target.value)}
      />
      <button onClick={handleFetch}>Load</button>

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}

      <h3>Join Neighbourhood</h3>
      <input
        placeholder="Household ID"
        value={householdId}
        onChange={e => setHouseholdId(e.target.value)}
      />
      <button onClick={handleJoin}>Join</button>

      {joinResult && (
        <pre>{JSON.stringify(joinResult, null, 2)}</pre>
      )}
    </Panel>
  );
}
