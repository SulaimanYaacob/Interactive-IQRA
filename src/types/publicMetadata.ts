import type { ROLE } from "~/utils/constants";

export interface ClerkPublicMetadata {
  role: ROLE;
  bio: string;
  profileImage: string;
  availability?: Availability;
}

type Availability = {
  mondayAvailability: boolean;
  mondayStart?: number;
  mondayEnd?: number;
  tuesdayAvailability: boolean;
  tuesdayStart?: number;
  tuesdayEnd?: number;
  wednesdayAvailability: boolean;
  wednesdayStart?: number;
  wednesdayEnd?: number;
  thursdayAvailability: boolean;
  thursdayStart?: number;
  thursdayEnd?: number;
  fridayAvailability: boolean;
  fridayStart?: number;
  fridayEnd?: number;
  saturdayAvailability: boolean;
  saturdayStart?: number;
  saturdayEnd?: number;
  sundayAvailability: boolean;
  sundayStart?: number;
  sundayEnd?: number;
};

type Notifications = {
  id: string;
  title: string;
  message: string;
};
