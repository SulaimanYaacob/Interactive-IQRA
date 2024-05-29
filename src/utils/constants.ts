export enum ROLE {
  TUTOR = "TUTOR",
  ADMIN = "ADMIN",
}

//! PrismaClient is too big, create your own enum instead.
export enum STATUS {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export const daysObject = {
  sunday: { name: "sunday", index: 0 },
  monday: { name: "monday", index: 1 },
  tuesday: { name: "tuesday", index: 2 },
  wednesday: { name: "wednesday", index: 3 },
  thursday: { name: "thursday", index: 4 },
  friday: { name: "friday", index: 5 },
  saturday: { name: "saturday", index: 6 },
};
