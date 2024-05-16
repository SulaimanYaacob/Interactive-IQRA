import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import chunk from "~/utils/paginationChunk";
import { STATUS } from "@prisma/client";
import { utapi } from "~/server/uploadthing";

export const tutorRouter = createTRPCRouter({
  getTutors: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        size: z.number().optional().default(3),
      })
    )
    .query(async ({ input }) => {
      try {
        const { search, size } = input;

        //! Can't use the offset and limit here due not having the metadata properties
        const users = await clerkClient.users.getUserList();

        if (!users)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Users not found",
          });

        //* If query exists filter the users
        if (search) {
          const filteredUsers = users.filter((user) => {
            const name = (user.firstName ?? "") + (user?.lastName ?? "");
            return name.toLowerCase().includes(search.toLowerCase());
          });

          const tutors = filteredUsers.filter((user) => {
            return user.publicMetadata.role === "TUTOR";
          });

          if (tutors.length === 0) return null;

          const listOfTutors = chunk(tutors, size);
          return listOfTutors;
        }

        //* Get the user who has role of a tutor in publicmetadata
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
  uploadApplication: protectedProcedure
    .input(
      z.object({
        files: z.array(
          z.object({
            key: z.string(),
            url: z.string(),
            name: z.string(),
            size: z.number(),
            type: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { files } = input;
        await ctx.db.tutorApplication.create({
          data: {
            createdByClerkId: ctx.auth.id,
            status: STATUS.PENDING,
            files: {
              createMany: {
                data: files,
              },
            },
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
  getUserApplicationStatus: protectedProcedure.query(async ({ ctx }) => {
    try {
      const status = await ctx.db.tutorApplication.findFirst({
        where: { createdByClerkId: ctx.auth.id },
        select: { status: true },
      });

      return status;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: (error as Error).message,
      });
    }
  }),
  cancelApplication: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const filesKey = await ctx.db.tutorApplication.findFirst({
        where: { createdByClerkId: ctx.auth.id },
        select: { applicationId: true, files: { select: { key: true } } },
      });

      if (!filesKey)
        throw new TRPCError({ code: "NOT_FOUND", message: "Files not found" });

      const { files, applicationId } = filesKey;

      //? Delete from UploadThing Server
      await utapi.deleteFiles(files.map((file) => file.key));

      //? Delete Entire Application with It's Files
      await ctx.db.tutorApplication.delete({
        where: { applicationId },
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: (error as Error).message,
      });
    }
  }),
});
