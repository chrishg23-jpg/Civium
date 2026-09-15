import { getDb } from '../sqliteClient';
import { Neighbourhood } from '../../core/types';

export class NeighbourhoodRepo {
  async create(neighbourhood: Neighbourhood) {
    const db = await getDb();
    await db.run(
      `INSERT INTO neighbourhoods (id, name, legitimacy_score)
       VALUES (?, ?, ?)`,
      neighbourhood.id,
      neighbourhood.name,
      neighbourhood.legitimacyScore
    );
  }

  async findById(id: string): Promise<Neighbourhood | null> {
    const db = await getDb();
    return db.get(`SELECT * FROM neighbourhoods WHERE id = ?`, id);
  }
}
