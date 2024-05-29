import type { ROLE } from "~/utils/constants";

export interface ClerkPublicMetadata {
  role: ROLE;
  bio: string;
  profileImage: string;
  availability?: Availability;
}

type Availability = {
  mondayAvailability: boolean;
  mondayStart?: string;
  mondayEnd?: string;
  tuesdayAvailability: boolean;
  tuesdayStart?: string;
  tuesdayEnd?: string;
  wednesdayAvailability: boolean;
  wednesdayStart?: string;
  wednesdayEnd?: string;
  thursdayAvailability: boolean;
  thursdayStart?: string;
  thursdayEnd?: string;
  fridayAvailability: boolean;
  fridayStart?: string;
  fridayEnd?: string;
  saturdayAvailability: boolean;
  saturdayStart?: string;
  saturdayEnd?: string;
  sundayAvailability: boolean;
  sundayStart?: string;
  sundayEnd?: string;
};

type Notifications = {
  id: string;
  title: string;
  message: string;
};
