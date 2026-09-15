import express from 'express';
import { CoreEngine } from '../../core/CoreEngine';
import { HouseholdRepo } from '../../db/repositories/householdRepo';

const router = express.Router();
const core = new CoreEngine();
const householdRepo = new HouseholdRepo();

// Create a household
router.post('/', async (req, res) => {
  const { address } = req.body;

  // 1. Core Engine creates household object
  const household = core.createHousehold(address);

  // 2. Save to DB
  await householdRepo.create(household);

  // 3. Return saved household
  res.json(household);
});

export default router;
