import { User } from "types/customer";

export type LoginResponse = {
  token: string;
  user: User;
};
