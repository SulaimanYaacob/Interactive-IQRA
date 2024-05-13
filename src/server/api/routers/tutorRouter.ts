import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";

export const tutorRouter = createTRPCRouter({
  getTutors: protectedProcedure.query(async () => {
    //! Can't use the offset and limit here due not having the metadata properties
    const users = await clerkClient.users.getUserList();

    if (!users)
      throw new TRPCError({ code: "NOT_FOUND", message: "Users not found" });

    // Get the user who has role of a tutor in publicmetadata
    const tutors = users.filter((user) => {
      return user.publicMetadata.role === "TUTOR";
    });

    return tutors;
  }),
});
