import express from 'express';
import { CoreEngine } from '../../core/CoreEngine';
import { SignalRepo } from '../../db/repositories/signalRepo';
import { CivicSignal } from '../../core/types';

const router = express.Router();
const core = new CoreEngine();
const signalRepo = new SignalRepo();

// Send a civic signal
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

  // 1. Route signal through Core Engine
  core.routeSignal(signal);

  // 2. Save to DB
  await signalRepo.create(signal);

  // 3. Return saved signal
  res.json(signal);
});

export default router;
