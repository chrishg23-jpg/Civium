import React, { useState } from 'react';
import { createHousehold } from '../api/client';

export function HouseholdDashboard() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<any>(null);

  async function handleCreate() {
    const household = await createHousehold(address);
    setResult(household);
  }

  return (
    <section style={{ marginBottom: '30px' }}>
      <h2>Household Dashboard</h2>

      <input
        placeholder="Household address"
        value={address}
        onChange={e => setAddress(e.target.value)}
      />

      <button onClick={handleCreate}>
        Create Household
      </button>

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </section>
  );
}
