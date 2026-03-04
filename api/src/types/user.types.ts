export interface IUser {
  id: string;
  google_Id: string;
  email: string;
  name: string;
  avatar?: string;
  provider?: "google";
  role: "USER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
}
