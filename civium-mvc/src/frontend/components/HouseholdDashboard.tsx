import React, { useState } from 'react';
import { createHousehold, getHousehold } from '../api/client';
import { Panel } from './ui/Panel';

export function HouseholdDashboard() {
  const [address, setAddress] = useState("");
  const [lookupId, setLookupId] = useState("");
  const [result, setResult] = useState<any>(null);

  async function handleCreate() {
    const household = await createHousehold(address);
    setResult(household);
  }

  async function handleLookup() {
    const household = await getHousehold(lookupId);
    setResult(household);
  }

  return (
    <Panel title="Households">
      <h3>Create Household</h3>
      <input
        placeholder="Address"
        value={address}
        onChange={e => setAddress(e.target.value)}
      />
      <button onClick={handleCreate}>Create Household</button>

      <h3>Lookup Household</h3>
      <input
        placeholder="Household ID"
        value={lookupId}
        onChange={e => setLookupId(e.target.value)}
      />
      <button onClick={handleLookup}>Lookup</button>

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </Panel>
  );
}
