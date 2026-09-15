import React, { useState } from 'react';
import { registerPerson } from '../api/client';

export function IdentityPanel() {
  const [name, setName] = useState("");
  const [householdId, setHouseholdId] = useState("");
  const [result, setResult] = useState<any>(null);

  async function handleRegister() {
    const person = await registerPerson(name, householdId);
    setResult(person);
  }

  return (
    <section style={{ marginBottom: '30px' }}>
      <h2>Identity & Legitimacy</h2>

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

      <button onClick={handleRegister}>
        Register Person
      </button>

      {result && (
        <div>
          <pre>{JSON.stringify(result, null, 2)}</pre>
          <p><strong>Legitimacy Score:</strong> {result.legitimacyScore}</p>
        </div>
      )}
    </section>
  );
}
