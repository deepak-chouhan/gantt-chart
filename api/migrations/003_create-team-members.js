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
  pgm.createTable("team_members", {
    team_id: {
      type: "uuid",
      notNull: true,
      references: "teams(id)",
      onDelete: "CASCADE",
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    role: {
      type: "varchar(50)",
      notNull: true,
      check: "role IN ('ADMIN', 'MEMBER')",
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("NOW()"),
    },
  });

  pgm.addConstraint("team_members", "team_members_pkey", {
    primaryKey: ["team_id", "user_id"],
  });

  pgm.createIndex("team_members", ["team_id"]);
  pgm.createIndex("team_members", ["user_id"]);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("team_members");
};
