import { User } from "types/customer";

export type LoginResponse = {
  token: string;
  user: User;
};

export interface RegisterResponse {
  token: string;
  user: User;
}
