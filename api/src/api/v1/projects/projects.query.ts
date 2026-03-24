import { pool } from "../../../config/db.js";

export const createProjectQuery = async (
  name: string,
  description: string | null,
  startDate: string,
  endDate: string,
  teamId: string,
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `
      INSERT INTO projects (name, description, start_date, end_date, team_id)
      VALUES($1, $2, $3, $4, $5)
      RETURNING id, name, description, start_date, end_date, team_id
      `,
      [name, description, startDate, endDate, teamId],
    );

    return rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getAllTeamProjectsQuery = async (teamId: string) => {
  const { rows } = await pool.query(
    `
    SELECT id, name, description, start_date, end_date, team_id
    FROM projects
    WHERE team_id = $1
    `,
    [teamId],
  );

  return rows;
};
