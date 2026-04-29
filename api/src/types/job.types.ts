export type JobStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
export type JobType = "CSV_IMPORT" | "CSV_EXPORT";

export interface Job {
  id: string;
  name: string;
  type: JobType;
  status: JobStatus;
  projectId: string;
  userId: string;
  retryCount: number;
  fileUrl: string | null;
  errorMessage: string | null;
}
