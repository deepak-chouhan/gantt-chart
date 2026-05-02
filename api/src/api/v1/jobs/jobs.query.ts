import { pool } from "../../../config/db.js";
import { IJob, JobType } from "../../../types/job.types.js";
import { toCamelCaseKeys } from "../../../utils/transform.js";

export const createJobQuery = async (
  name: string,
  type: JobType,
  projectId: string,
  userId: string,
) => {
  const { rows } = await pool.query(
    `
    INSERT INTO jobs (name, type, project_id, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, type, status, project_id, user_id, retry_count, fileUrl, error_message
    `,
    [name, type, projectId, userId],
  );

  return toCamelCaseKeys<IJob>(rows[0]);
};

export const getJobByIdQuery = async (jobId: string) => {
  const { rows } = await pool.query(
    `
    SELECT id, name, type, status, project_id, user_id, retry_count, fileUrl, error_message
    FROM jobs WHERE id = $1 LIMIT 1
    `,
    [jobId],
  );

  return rows[0] ? toCamelCaseKeys<IJob>(rows[0]) : null;
};
