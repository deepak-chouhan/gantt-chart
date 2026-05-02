import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../../config/s3.js";
import { ErrorCode } from "../../../types/error.types.js";
import AppError from "../../../utils/appError.js";
import { assertProjectExists } from "../projects/projects.service.js";
import { assertTeamMember } from "../teams/teams.service.js";
import { createJobQuery, getJobByIdQuery } from "./jobs.query.js";
import { env } from "../../../config/env.js";

export const enqueueExport = async (projectId: string, userId: string) => {
  const project = await assertProjectExists(projectId);
  await assertTeamMember(project.teamId, userId);

  const jobName = `Export ${project.name}`;
  const job = await createJobQuery(jobName, "CSV_EXPORT", projectId, userId);

  // TODO: Add the job to queue

  return job;
};

export const enqueueImport = async (
  projectId: string,
  userId: string,
  fileBuffer: Buffer,
  fileName: string,
) => {
  const project = await assertProjectExists(projectId);
  await assertTeamMember(project.teamId, userId);

  const s3Key = `import/${projectId}/${Date.now()}_${fileName}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: env.aws.bucketName,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: "text/csv",
    }),
  );

  const jobName = `Import ${fileName}`;
  const job = await createJobQuery(jobName, "CSV_IMPORT", projectId, userId);

  // TODO: Add the job to queue
  
  return job;
};

export const getJob = async (jobId: string, userId: string) => {
  const job = await getJobByIdQuery(jobId);
  if (!job) {
    throw new AppError(ErrorCode.RESOURCE_NOT_FOUND, "Job not found");
  }

  if (job.userId !== userId) {
    throw new AppError(ErrorCode.FORBIDDEN_ACCESS, "Access denied");
  }

  return job;
};
