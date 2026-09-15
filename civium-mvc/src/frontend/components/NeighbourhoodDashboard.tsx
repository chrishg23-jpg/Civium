import React, { useState } from 'react';
import { getNeighbourhood, joinNeighbourhood } from '../api/client';

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
    <section style={{ marginBottom: '30px' }}>
      <h2>Neighbourhood Dashboard</h2>

      <h3>Load Neighbourhood</h3>
      <input
        placeholder="Neighbourhood ID"
        value={id}
        onChange={e => setId(e.target.value)}
      />
      <button onClick={handleFetch}>Load Neighbourhood</button>

      {result && (
        <div>
          <pre>{JSON.stringify(result, null, 2)}</pre>
          <p><strong>Legitimacy Score:</strong> {result.legitimacyScore}</p>
        </div>
      )}

      <h3>Join Neighbourhood</h3>
      <input
        placeholder="Household ID"
        value={householdId}
        onChange={e => setHouseholdId(e.target.value)}
      />
      <button onClick={handleJoin}>Join Neighbourhood</button>

      {joinResult && (
        <div>
          <h4>Updated Neighbourhood</h4>
          <pre>{JSON.stringify(joinResult, null, 2)}</pre>
        </div>
      )}
    </section>
  );
}
