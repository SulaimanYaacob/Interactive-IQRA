import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import chunk from "~/utils/paginationChunk";

export const tutorRouter = createTRPCRouter({
  getTutors: protectedProcedure
    .input(
      z.object({
        query: z.string().optional(),
        size: z.number().optional().default(3),
      })
    )
    .query(async ({ input }) => {
      try {
        //! Can't use the offset and limit here due not having the metadata properties
        const { query, size } = input;

        const users = await clerkClient.users.getUserList({
          query: query ?? "",
        });

        if (!users)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Users not found",
          });

        // Get the user who has role of a tutor in publicmetadata
        const tutors = users.filter((user) => {
          return user.publicMetadata.role === "TUTOR";
        });

        if (tutors.length === 0) return null;

        const listOfTutors = chunk(tutors, size);

        return listOfTutors;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
});
