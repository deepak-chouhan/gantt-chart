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
  pgm.createTable("projects", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    name: { type: "varchar(255)", notNull: true },
    description: { type: "text" },
    start_date: { type: "timestamptz", notNull: true },
    end_date: { type: "timestamptz", notNull: true },
    team_id: {
      type: "uuid",
      notNull: true,
      references: "teams(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.addConstraint("projects", "projects_valid_date_range", {
    check: "start_date <= end_date",
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("projects");
};
