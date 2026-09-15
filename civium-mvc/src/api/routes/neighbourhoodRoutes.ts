import express from 'express';
import { CoreEngine } from '../../core/CoreEngine';
import { Neighbourhood } from '../../core/types';

const router = express.Router();
const core = new CoreEngine();

// Create a neighbourhood
router.post('/', (req, res) => {
  const { name } = req.body;
  const neighbourhood: Neighbourhood = {
    id: crypto.randomUUID(),
    name,
    households: [],
    legitimacyScore: 50
  };
  res.json(neighbourhood);
});

// Join a neighbourhood
router.post('/:id/join', (req, res) => {
  const neighbourhoodId = req.params.id;
  const household = req.body.household;
  const neighbourhood = req.body.neighbourhood;

  const updated = core.joinNeighbourhood(household, neighbourhood);
  res.json(updated);
});

export default router;
