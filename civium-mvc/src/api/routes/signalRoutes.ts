import express from 'express';
import { CoreEngine } from '../../core/CoreEngine';
import { SignalRepo } from '../../db/repositories/signalRepo';
import { PersonRepo } from '../../db/repositories/personRepo';
import { HouseholdRepo } from '../../db/repositories/householdRepo';
import { NeighbourhoodRepo } from '../../db/repositories/neighbourhoodRepo';
import { CivicSignal } from '../../core/types';

const router = express.Router();
const core = new CoreEngine();
const signalRepo = new SignalRepo();
const personRepo = new PersonRepo();
const householdRepo = new HouseholdRepo();
const neighbourhoodRepo = new NeighbourhoodRepo();

router.post('/', async (req, res) => {
  const signal: CivicSignal = {
    id: crypto.randomUUID(),
    type: req.body.type,
    fromPersonId: req.body.fromPersonId,
    householdId: req.body.householdId,
    neighbourhoodId: req.body.neighbourhoodId,
    payload: req.body.payload,
    createdAt: new Date()
  };

  // 1. Save signal
  await signalRepo.create(signal);

  // 2. Load all signals for legitimacy update
  const db = await import('../../db/sqliteClient');
  const conn = await db.getDb();
  const signals = await conn.all(`SELECT * FROM civic_signals`);

  // 3. Run legitimacy update flow
  const updated = await core.updateLegitimacyFlow(
    signal.fromPersonId,
    signal.householdId!,
    signal.neighbourhoodId!,
    signals
  );

  // 4. Save updated legitimacy scores
  await conn.run(
    `UPDATE persons SET legitimacy_score = ? WHERE id = ?`,
    updated.personScore.score,
    signal.fromPersonId
  );

  await conn.run(
    `UPDATE households SET legitimacy_score = ? WHERE id = ?`,
    updated.householdScore.score,
    signal.householdId
  );

  await conn.run(
    `UPDATE neighbourhoods SET legitimacy_score = ? WHERE id = ?`,
    updated.neighbourhoodScore.score,
    signal.neighbourhoodId
  );

  res.json({
    status: "Signal processed",
    signal,
    legitimacy: updated
  });
});

export default router;
