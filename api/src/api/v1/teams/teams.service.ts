import { createTeamQuery } from "./teams.query.js";

export const createTeam = async (name: string, userId: string) => {
  return await createTeamQuery(name, userId);
};
