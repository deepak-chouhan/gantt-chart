import { pool } from "../../../config/db.js";

export const createTeamQuery = async (name: string, ownerId: string) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `
      INSERT INTO teams (name, owner_id) 
      VALUES ($1, $2)
      RETURNING id, name, owner_id, created_at
      `,
      [name, ownerId],
    );
    const team = rows[0];

    await client.query(
      `
      INSERT INTO team_members (team_id, user_id, role)
      VALUES ($1, $2, 'ADMIN')
      `,
      [team.id, ownerId],
    );

    await client.query("COMMIT");
    return team;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
