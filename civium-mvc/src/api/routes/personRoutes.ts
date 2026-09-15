import express from 'express';
import { CoreEngine } from '../../core/CoreEngine';

const router = express.Router();
const core = new CoreEngine();

// Register a person
router.post('/', (req, res) => {
  const { name, householdId } = req.body;
  const person = core.registerPerson(name, householdId);
  res.json(person);
});

export default router;
