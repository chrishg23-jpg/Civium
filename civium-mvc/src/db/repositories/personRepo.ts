import { getDb } from '../sqliteClient';
import { Person } from '../../core/types';

export class PersonRepo {
  async create(person: Person) {
    const db = await getDb();
    await db.run(
      `INSERT INTO persons (id, name, household_id, identity_token, legitimacy_score, tier)
       VALUES (?, ?, ?, ?, ?, ?)`,
      person.id,
      person.name,
      person.householdId,
      person.identityToken,
      person.legitimacyScore,
      person.tier
    );
  }

  async findById(id: string): Promise<Person | null> {
    const db = await getDb();
    return db.get(`SELECT * FROM persons WHERE id = ?`, id);
  }
}
