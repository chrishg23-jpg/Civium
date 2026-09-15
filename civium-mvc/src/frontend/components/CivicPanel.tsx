import React, { useState } from 'react';
import { sendSignal } from '../api/client';

export function CivicPanel() {
  const [type, setType] = useState("PROPOSAL");
  const [fromPersonId, setFromPersonId] = useState("");
  const [payload, setPayload] = useState("");
  const [result, setResult] = useState<any>(null);

  async function handleSend() {
    const signal = await sendSignal({
      type,
      fromPersonId,
      payload: { text: payload }
    });
    setResult(signal);
  }

  return (
    <section style={{ marginBottom: '30px' }}>
      <h2>Civic Participation</h2>

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
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </section>
  );
}
