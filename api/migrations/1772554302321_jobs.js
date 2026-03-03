/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createType("job_status", [
    "NOT_STARTED",
    "IN_PROGRESS",
    "COMPLETED",
    "FAILED",
  ]);

  pgm.createType("job_type", ["CSV_IMPORT", "CSV_EXPORT"]);

  pgm.createTable("jobs", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    name: { type: "varchar(255)", notNull: true },
    type: { type: "job_type", notNull: true },
    user_id: {
      type: "uuid",
      references: "users(id)",
      onDelete: "CASCADE",
    },
    project_id: {
      type: "uuid",
      references: "projects(id)",
      onDelete: "CASCADE",
    },
    file_url: { type: "text" },
    retry_count: { type: "int", notNull: true, default: 0 },
    status: {
      type: "job_status",
      notNull: true,
      default: "NOT_STARTED",
    },
    error_message: { type: "text" },
  });

  pgm.createIndex("jobs", ["project_id"]);
  pgm.createIndex("jobs", ["user_id"]);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("jobs");
  pgm.dropType("job_status", { ifExists: true });
  pgm.dropType("job_type", { ifExists: true });
};
