import React, { useState } from 'react';
import { getPerson, getHousehold, getNeighbourhood } from '../api/client';

export function LookupPanel() {
  const [personId, setPersonId] = useState("");
  const [householdId, setHouseholdId] = useState("");
  const [neighbourhoodId, setNeighbourhoodId] = useState("");

  const [personResult, setPersonResult] = useState<any>(null);
  const [householdResult, setHouseholdResult] = useState<any>(null);
  const [neighbourhoodResult, setNeighbourhoodResult] = useState<any>(null);

  async function handlePersonLookup() {
    const result = await getPerson(personId);
    setPersonResult(result);
  }

  async function handleHouseholdLookup() {
    const result = await getHousehold(householdId);
    setHouseholdResult(result);
  }

  async function handleNeighbourhoodLookup() {
    const result = await getNeighbourhood(neighbourhoodId);
    setNeighbourhoodResult(result);
  }

  return (
    <section style={{ marginBottom: '30px' }}>
      <h2>Lookup Panel</h2>

      <h3>Lookup Person</h3>
      <input
        placeholder="Person ID"
        value={personId}
        onChange={e => setPersonId(e.target.value)}
      />
      <button onClick={handlePersonLookup}>Lookup Person</button>
      {personResult && (
        <pre>{JSON.stringify(personResult, null, 2)}</pre>
      )}

      <h3>Lookup Household</h3>
      <input
        placeholder="Household ID"
        value={householdId}
        onChange={e => setHouseholdId(e.target.value)}
      />
      <button onClick={handleHouseholdLookup}>Lookup Household</button>
      {householdResult && (
        <pre>{JSON.stringify(householdResult, null, 2)}</pre>
      )}

      <h3>Lookup Neighbourhood</h3>
      <input
        placeholder="Neighbourhood ID"
        value={neighbourhoodId}
        onChange={e => setNeighbourhoodId(e.target.value)}
      />
      <button onClick={handleNeighbourhoodLookup}>Lookup Neighbourhood</button>
      {neighbourhoodResult && (
        <pre>{JSON.stringify(neighbourhoodResult, null, 2)}</pre>
      )}
    </section>
  );
}
