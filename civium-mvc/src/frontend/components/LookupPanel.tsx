import React, { useState } from 'react';
import { getPerson, getHousehold, getNeighbourhood } from '../api/client';
import { Panel } from './ui/Panel';

export function LookupPanel() {
  const [personId, setPersonId] = useState("");
  const [householdId, setHouseholdId] = useState("");
  const [neighbourhoodId, setNeighbourhoodId] = useState("");

  const [personResult, setPersonResult] = useState<any>(null);
  const [householdResult, setHouseholdResult] = useState<any>(null);
  const [neighbourhoodResult, setNeighbourhoodResult] = useState<any>(null);

  return (
    <Panel title="Lookup">
      <h3>Person</h3>
      <input
        placeholder="Person ID"
        value={personId}
        onChange={e => setPersonId(e.target.value)}
      />
      <button onClick={async () => {
        setPersonResult(await getPerson(personId));
      }}>Lookup Person</button>

      {personResult && (
        <pre>{JSON.stringify(personResult, null, 2)}</pre>
      )}

      <h3>Household</h3>
      <input
        placeholder="Household ID"
        value={householdId}
        onChange={e => setHouseholdId(e.target.value)}
      />
      <button onClick={async () => {
        setHouseholdResult(await getHousehold(householdId));
      }}>Lookup Household</button>

      {householdResult && (
        <pre>{JSON.stringify(householdResult, null, 2)}</pre>
      )}

      <h3>Neighbourhood</h3>
      <input
        placeholder="Neighbourhood ID"
        value={neighbourhoodId}
        onChange={e => setNeighbourhoodId(e.target.value)}
      />
      <button onClick={async () => {
        setNeighbourhoodResult(await getNeighbourhood(neighbourhoodId));
      }}>Lookup Neighbourhood</button>

      {neighbourhoodResult && (
        <pre>{JSON.stringify(neighbourhoodResult, null, 2)}</pre>
      )}
    </Panel>
  );
}
