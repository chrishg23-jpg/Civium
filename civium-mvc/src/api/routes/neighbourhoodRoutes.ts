import express from 'express';
import { CoreEngine } from '../../core/CoreEngine';
import { NeighbourhoodRepo } from '../../db/repositories/neighbourhoodRepo';
import { Neighbourhood } from '../../core/types';

const router = express.Router();
const core = new CoreEngine();
const neighbourhoodRepo = new NeighbourhoodRepo();

// Create a neighbourhood
router.post('/', async (req, res) => {
  const { name } = req.body;

  const neighbourhood: Neighbourhood = {
    id: crypto.randomUUID(),
    name,
    households: [],
    legitimacyScore: 50
  };

  // Save to DB
  await neighbourhoodRepo.create(neighbourhood);

  res.json(neighbourhood);
});

// Join a neighbourhood
router.post('/:id/join', async (req, res) => {
  const neighbourhood = req.body.neighbourhood;
  const household = req.body.household;

  // 1. Core Engine updates neighbourhood object
  const updated = core.joinNeighbourhood(household, neighbourhood);

  // 2. Save updated neighbourhood
  await neighbourhoodRepo.create(updated);

  res.json(updated);
});

export default router;
