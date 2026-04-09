import { pool } from "../../../config/db.js";
import { ITask, ITaskWithSubTasks } from "../../../types/task.types.js";
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
    INSER INTO tasks
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
