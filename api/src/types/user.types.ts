export interface IUser {
  _id: string;
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  provider: "google";
  role: "USER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
}
