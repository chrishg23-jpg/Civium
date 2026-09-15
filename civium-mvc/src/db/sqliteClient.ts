import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export async function getDb(): Promise<Database> {
  return open({
    filename: './civium.db',
    driver: sqlite3.Database
  });
}
