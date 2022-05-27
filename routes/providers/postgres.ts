import pg from 'pg';

class Postgres {
  private static client: pg.Pool;

  static getClient() {
    if (Postgres.client) {
      return Postgres.client;
    }

    Postgres.client = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    return Postgres.client;
  }
}

export default Postgres;