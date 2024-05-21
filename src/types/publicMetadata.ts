import type { ROLE } from "~/utils/constants";

export interface ClerkPublicMetadata {
  profileImage: string;
  bio: string;
  role: ROLE;
}

type availability = {
  available: boolean;
  message: string;
};
