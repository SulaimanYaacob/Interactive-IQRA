import type { ROLE } from "~/utils/constants";

export interface ClerkPublicMetadata {
  role: ROLE;
  bio: string;
  profileImage: string;
  availability?: Availability;
}

type Availability = {
  mondayAvailability: boolean;
  mondayStart?: Date;
  mondayEnd?: Date;
  tuesdayAvailability: boolean;
  tuesdayStart?: Date;
  tuesdayEnd?: Date;
  wednesdayAvailability: boolean;
  wednesdayStart?: Date;
  wednesdayEnd?: Date;
  thursdayAvailability: boolean;
  thursdayStart?: Date;
  thursdayEnd?: Date;
  fridayAvailability: boolean;
  fridayStart?: Date;
  fridayEnd?: Date;
  saturdayAvailability: boolean;
  saturdayStart?: Date;
  saturdayEnd?: Date;
  sundayAvailability: boolean;
  sundayStart?: Date;
  sundayEnd?: Date;
};

type Notifications = {
  id: string;
  title: string;
  message: string;
};
