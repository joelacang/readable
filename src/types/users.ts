import type { Role } from "@prisma/client";

export type UserType = {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  role?: Role;
};

export type UserPreviewType = {
  id: string;
  name: string;
  image: string | null;
};
