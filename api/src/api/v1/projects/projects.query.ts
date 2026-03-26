import { pool } from "../../../config/db.js";
import { IProject } from "../../../types/project.types.js";
import AppError from "../../../utils/appError.js";
import { ErrorCode } from "../../../types/error.types.js";
import { toCamelCaseKeys } from "../../../utils/transform.js";

export const createProjectQuery = async (
  name: string,
  description: string | null,
  startDate: string,
  endDate: string,
  teamId: string,
): Promise<IProject> => {
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

    await client.query("COMMIT");

    return toCamelCaseKeys(rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getProjectsByTeamIdQuery = async (
  teamId: string,
): Promise<IProject[]> => {
  const { rows } = await pool.query(
    `
    SELECT id, name, description, start_date, end_date, team_id
    FROM projects
    WHERE team_id = $1
    `,
    [teamId],
  );

  return rows.map((row) => toCamelCaseKeys(row));
};

export const getProjectByIdQuery = async (
  projectId: string,
): Promise<IProject | null> => {
  const { rows } = await pool.query(
    `
    SELECT id, name, description, start_date, end_date, team_id
    FROM projects
    WHERE id = $1 LIMIT 1
    `,
    [projectId],
  );

  return rows[0] ? toCamelCaseKeys<IProject>(rows[0]) : null;
};

export const updateProjectQuery = async (
  projectId: string,
  fields: Partial<
    Pick<IProject, "name" | "description" | "statDate" | "endDate">
  >,
): Promise<IProject | null> => {
  const updates: string[] = [];
  const values: unknown[] = [];

  let idx = 1;

  if (fields.name !== undefined) {
    updates.push(`name = $${idx++}`);
    values.push(fields.name);
  }
  if (fields.description !== undefined) {
    updates.push(`description = $${idx++}`);
    values.push(fields.description);
  }
  if (fields.statDate !== undefined) {
    updates.push(`start_date = $${idx++}`);
    values.push(fields.statDate);
  }
  if (fields.endDate !== undefined) {
    updates.push(`end_date = $${idx++}`);
    values.push(fields.endDate);
  }

  if (updates.length === 0) {
    throw new AppError(ErrorCode.INVALID_INPUT, "No fields provided to update");
  }

  values.push(projectId);

  const { rows } = await pool.query(
    `
      UPDATE projects SET ${updates.join(", ")}
      WHERE id = $${idx}
      RETURNING id, name, description, start_date, end_date, team_id
      `,
    values,
  );

  return rows[0] ? toCamelCaseKeys<IProject>(rows[0]) : null;
};
