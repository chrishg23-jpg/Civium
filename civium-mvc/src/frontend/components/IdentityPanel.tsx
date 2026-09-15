import React, { useState } from 'react';
import { registerPerson } from '../api/client';
import { Panel } from './ui/Panel';

export function IdentityPanel() {
  const [name, setName] = useState("");
  const [householdId, setHouseholdId] = useState("");
  const [result, setResult] = useState<any>(null);

  async function handleRegister() {
    const person = await registerPerson(name, householdId);
    setResult(person);
  }

  return (
    <Panel title="Identity">
      <input
        placeholder="Person name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        placeholder="Household ID"
        value={householdId}
        onChange={e => setHouseholdId(e.target.value)}
      />

      <button onClick={handleRegister}>Register Person</button>

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </Panel>
  );
}
