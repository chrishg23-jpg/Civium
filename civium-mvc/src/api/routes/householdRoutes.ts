import express from 'express';
import { CoreEngine } from '../../core/CoreEngine';

const router = express.Router();
const core = new CoreEngine();

// Create a household
router.post('/', (req, res) => {
  const { address } = req.body;
  const household = core.createHousehold(address);
  res.json(household);
});

export default router;
