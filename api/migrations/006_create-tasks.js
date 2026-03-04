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
  pgm.createType("task_status", [
    "OPEN",
    "IN_PROGRESS",
    "COMPLETED",
    "BLOCKED",
  ]);

  pgm.createTable("tasks", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    name: { type: "varchar(255)", notNull: true },
    status: {
      type: "task_status",
      notNull: true,
      default: "OPEN",
    },
    start_date: { type: "timestamptz", notNull: true },
    end_date: { type: "timestamptz", notNull: true },
    assignee_id: {
      type: "uuid",
      references: "users(id)",
      onDelete: "CASCADE",
    },
    project_id: {
      type: "uuid",
      references: "projects(id)",
      onDelete: "CASCADE",
    },
    parent_task_id: {
      type: "uuid",
      references: "tasks(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.createConstraint("tasks", "tasks_parent_ne_task", {
    check: "id != parent_task_id",
  });

  pgm.createConstraint("tasks", "tasks_valid_date_range", {
    check: "start_date <= end_date",
  });

  pgm.createIndex("tasks", ["project_id"]);
  pgm.createIndex("tasks", ["assignee_id"]);
  pgm.createIndex("tasks", ["parent_task_id"]);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("tasks");
  pgm.dropType("task_status", { ifExists: true });
};
