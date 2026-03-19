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

export const getTeamsByUserIdQuery = async (userId: string) => {
  const { rows } = await pool.query(
    `
    SELECT t.id, t.name, t.owner_id, t.created_at
    FROM teams t
    INNER JOIN team_members tm ON tm.team_id = t.id
    WHERE tm.user_id = $1
    ORDER BY t.created_at DESC
    `,
    [userId],
  );

  return rows;
};

export const getTeamMembershipQuery = async (
  teamId: string,
  userId: string,
) => {
  const { rows } = await pool.query(
    `
    SELECT team_id, user_id, role, created_at
    FOM team_member
    WHERE team_id = $1 AND user_id = $2
    LIMIT 1
    `,
    [teamId, userId],
  );

  return rows[0] || null;
};

export const getTeamWithMembersQuery = async (teamId: string) => {
  const { rows } = await pool.query(
    `
    SELECT t.id, t.name, t.owner_id, t.created_at,
    json_agg(
      json_build_object(
        "userId", u.id,
        "name", u.name,
        "email", u.email,
        "avatarUrl", u.avatar_url,
        "role", tm.role,
        "joinedAt", tm.created_at
      )
    ) as members
    FROM teams t
    INNER JOIN team_members tm ON t.team_id = t.id
    INNER JOIN users u on u.id = tm.user_id
    WHERE t.id = $1
    GROUP BY t.id
    `,
    [teamId],
  );

  return rows[0] || null;
};

export const updateTeamQuery = async (teamId: string, name: string) => {
  const { rows } = await pool.query(
    `
    UPDATE teams SET name = $1
    WHERE id = $2
    `,
    [name, teamId],
  );

  return rows[0];
};

export const deleteTeamQuery = async (teamId: string) => {
  await pool.query("DELETE FROM teams WHERE id = $1", [teamId]);
};

export const addMemberQuery = async (teamId: string, userId: string) => {
  const { rows } = await pool.query(
    `
    INSERT INTO team_members (team_id, user_id, role)
    VALUES ($1, $2, 'MEMBER')
    RETURNING team_id, user_id, role, created_at
    `,
    [teamId, userId],
  );

  return rows[0];
};

export const removeMemberQuery = async (teamId: string, userId: string) => {
  await pool.query(
    `
    DELETE FROM team_members
    WHERE team_id = $1 AND user_id = $2
    `,
    [teamId, userId],
  );
};
