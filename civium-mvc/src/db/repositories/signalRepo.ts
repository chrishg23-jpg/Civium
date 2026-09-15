import { getDb } from '../sqliteClient';
import { CivicSignal } from '../../core/types';

export class SignalRepo {
  async create(signal: CivicSignal) {
    const db = await getDb();
    await db.run(
      `INSERT INTO civic_signals (id, type, from_person_id, household_id, neighbourhood_id, payload, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      signal.id,
      signal.type,
      signal.fromPersonId,
      signal.householdId || null,
      signal.neighbourhoodId || null,
      JSON.stringify(signal.payload),
      signal.createdAt.toISOString()
    );
  }
}
