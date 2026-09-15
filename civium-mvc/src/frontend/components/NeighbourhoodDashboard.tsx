import React, { useState } from 'react';
import { getNeighbourhood } from '../api/client';

export function NeighbourhoodDashboard() {
  const [id, setId] = useState("");
  const [result, setResult] = useState<any>(null);

  async function handleFetch() {
    const neighbourhood = await getNeighbourhood(id);
    setResult(neighbourhood);
  }

  return (
    <section style={{ marginBottom: '30px' }}>
      <h2>Neighbourhood Dashboard</h2>

      <input
        placeholder="Neighbourhood ID"
        value={id}
        onChange={e => setId(e.target.value)}
      />

      <button onClick={handleFetch}>
        Load Neighbourhood
      </button>

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </section>
  );
}
