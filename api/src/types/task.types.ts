export type TaskStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";

export interface ITask {
  id: string;
  name: string;
  status: TaskStatus;
  startDate: string;
  endDate: string;
  projectId: string;
  assigneeId: string | null;
  parentTaskId: string | null;
}

export interface ITaskWithSubTasks extends ITask {
  subtasks: ITask[];
}
