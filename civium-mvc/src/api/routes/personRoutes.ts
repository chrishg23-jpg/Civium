import express from 'express';
import { CoreEngine } from '../../core/CoreEngine';
import { PersonRepo } from '../../db/repositories/personRepo';

const router = express.Router();
const core = new CoreEngine();
const personRepo = new PersonRepo();

// Register a person
router.post('/', async (req, res) => {
  const { name, householdId } = req.body;

  // 1. Core Engine creates person object
  const person = core.registerPerson(name, householdId);

  // 2. Save to DB
  await personRepo.create(person);

  // 3. Return saved person
  res.json(person);
});

export default router;
