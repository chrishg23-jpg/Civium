import React, { useState } from 'react';
import { sendSignal } from '../api/client';
import { Panel } from './ui/Panel';

export function CivicPanel() {
  const [type, setType] = useState("PROPOSAL");
  const [fromPersonId, setFromPersonId] = useState("");
  const [payload, setPayload] = useState("");
  const [result, setResult] = useState<any>(null);

  async function handleSend() {
    const response = await sendSignal({
      type,
      fromPersonId,
      payload: { text: payload }
    });
    setResult(response);
  }

  return (
    <Panel title="Civic Participation">
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="PROPOSAL">Proposal</option>
        <option value="VOTE">Vote</option>
        <option value="REQUEST">Request</option>
        <option value="REPORT">Report</option>
      </select>

      <input
        placeholder="Person ID"
        value={fromPersonId}
        onChange={e => setFromPersonId(e.target.value)}
      />

      <input
        placeholder="Payload text"
        value={payload}
        onChange={e => setPayload(e.target.value)}
      />

      <button onClick={handleSend}>
        Send Signal
      </button>

      {result && (
        <div>
          <pre>{JSON.stringify(result, null, 2)}</pre>

          <h3>Updated Legitimacy</h3>
          <p><strong>Person:</strong> {result.legitimacy.personScore.score}</p>
          <p><strong>Household:</strong> {result.legitimacy.householdScore.score}</p>
          <p><strong>Neighbourhood:</strong> {result.legitimacy.neighbourhoodScore.score}</p>
        </div>
      )}
    </Panel>
  );
}
