import { createTeamQuery, getTeamsByUserIdQuery } from "./teams.query.js";

export const createTeam = async (name: string, userId: string) => {
  return await createTeamQuery(name, userId);
};

export const getMyTeams = async (userId: string) => {
  return await getTeamsByUserIdQuery(userId);
};
