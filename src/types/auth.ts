export type Role = "admin" | "user";

export type SignedInUser = {
  username: string;
  role: Role;
};

export type LoginResponse = {
  token: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: {
    id: number;
    username: string;
    role: Role;
  };
};
