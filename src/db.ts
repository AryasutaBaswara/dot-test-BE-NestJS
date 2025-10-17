// src/db.ts
import { Pool, QueryResult, QueryResultRow } from 'pg'; // Impor 'QueryResult'
import 'dotenv/config';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const db = {
  // Buat fungsi query menjadi "pintar" dengan Generics (<T>)
  query: <T extends QueryResultRow>(
    text: string,
    params: any[],
  ): Promise<QueryResult<T>> => pool.query<T>(text, params),
  pool: pool,
};
