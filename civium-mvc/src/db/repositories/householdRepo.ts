import { getDb } from '../sqliteClient';
import { Household } from '../../core/types';

export class HouseholdRepo {
  async create(household: Household) {
    const db = await getDb();
    await db.run(
      `INSERT INTO households (id, address, neighbourhood_id, legitimacy_score)
       VALUES (?, ?, ?, ?)`,
      household.id,
      household.address,
      household.neighbourhoodId || null,
      household.legitimacyScore
    );
  }

  async findById(id: string): Promise<Household | null> {
    const db = await getDb();
    return db.get(`SELECT * FROM households WHERE id = ?`, id);
  }
}
