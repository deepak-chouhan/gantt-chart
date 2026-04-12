import { pool } from "../../../config/db.js";
import { ErrorCode } from "../../../types/error.types.js";
import { ITask, ITaskWithSubTasks } from "../../../types/task.types.js";
import AppError from "../../../utils/appError.js";
import { toCamelCaseKeys } from "../../../utils/transform.js";

export const createTaskQuery = async (
  name: string,
  status: string,
  startDate: string,
  endDate: string,
  projectId: string,
  assigneeId: string | null,
  parentTaskId: string | null,
): Promise<ITask> => {
  const { rows } = await pool.query(
    `
    INSERT INTO tasks
    (name, status, start_date, end_date, project_id, assignee_id, parent_task_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, name, start_date, end_date, project_id, assignee_id, parent_task_id
    `,
    [name, status, startDate, endDate, projectId, assigneeId, parentTaskId],
  );

  return toCamelCaseKeys<ITask>(rows[0]);
};

export const getTasksByProjectIdQuery = async (projectId: string) => {
  const { rows } = await pool.query(
    `
    SELECT
      id, name, status, start_date, end_date, project_id, assignee_id, parent_task_id
    FROM tasks
    WHERE project_id = $1
    `,
    [projectId],
  );

  const allTasks: ITask[] = rows.map((row) => toCamelCaseKeys(row));

  // Build map of all tasks
  const taskMap = new Map<string, ITaskWithSubTasks>();
  for (const task of allTasks) {
    taskMap.set(task.id, { ...task, subtasks: [] });
  }

  // Use mapped tasks to nest subtasks under parent
  const rootTask: ITaskWithSubTasks[] = [];
  for (const task of taskMap.values()) {
    if (task.parentTaskId) {
      const parent = taskMap.get(task.parentTaskId);
      if (parent) {
        parent.subtasks.push(task);
      }
    } else {
      rootTask.push(task);
    }
  }

  return rootTask;
};

export const getTaskByIdQuery = async (taskId: string) => {
  const { rows } = await pool.query(
    `
    SELECT id, name, status, start_date, end_date, project_id, assignee_id, parent_task_id
    FROM tasks
    WHERE id = $1 LIMIT 1
    `,
    [taskId],
  );

  return rows[0] ? toCamelCaseKeys<ITask>(rows[0]) : null;
};

export const updateTaskQuery = async (
  taskId: string,
  fields: Partial<
    Pick<
      ITask,
      | "name"
      | "status"
      | "startDate"
      | "endDate"
      | "assigneeId"
      | "parentTaskId"
    >
  >,
) => {
  const updates: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (fields.name !== undefined) {
    updates.push(`name=$${idx++}`);
    values.push(fields.name);
  }
  if (fields.status !== undefined) {
    updates.push(`status=$${idx++}`);
    values.push(fields.status);
  }
  if (fields.startDate !== undefined) {
    updates.push(`start_date=$${idx++}`);
    values.push(fields.startDate);
  }
  if (fields.endDate !== undefined) {
    updates.push(`end_date=$${idx++}`);
    values.push(fields.endDate);
  }
  if (fields.assigneeId !== undefined) {
    updates.push(`assignee_id=$${idx++}`);
    values.push(fields.assigneeId);
  }
  if (fields.parentTaskId !== undefined) {
    updates.push(`parent_task_id=$${idx++}`);
    values.push(fields.parentTaskId);
  }

  values.push(taskId);

  if (updates.length === 0) {
    throw new AppError(ErrorCode.INVALID_INPUT, "No fields provided to update");
  }

  const { rows } = await pool.query(
    `
    UPDATE tasks
    SET ${updates.join(", ")}
    WHERE id=$${idx}
    RETURNING name, status, start_date, end_date, assignee_id, project_id, parent_task_id
    `,
    values,
  );

  return rows[0] ? toCamelCaseKeys<ITask>(rows[0]) : null;
};

export const deleteTaskQuery = async (taskId: string) => {
  await pool.query("DELETE FROM tasks WHERE id=$1", [taskId]);
};
