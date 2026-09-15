import express from 'express';
import { CoreEngine } from '../../core/CoreEngine';
import { CivicSignal } from '../../core/types';

const router = express.Router();
const core = new CoreEngine();

// Send a civic signal
router.post('/', (req, res) => {
  const signal: CivicSignal = {
    id: crypto.randomUUID(),
    type: req.body.type,
    fromPersonId: req.body.fromPersonId,
    householdId: req.body.householdId,
    neighbourhoodId: req.body.neighbourhoodId,
    payload: req.body.payload,
    createdAt: new Date()
  };

  core.routeSignal(signal);
  res.json({ status: 'Signal routed', signal });
});

export default router;
