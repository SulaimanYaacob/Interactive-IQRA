import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import chunk from "~/utils/paginationChunk";
import { utapi } from "~/server/uploadthing";
import { ROLE, STATUS } from "~/utils/constants";

export const tutorRouter = createTRPCRouter({
  getTutors: publicProcedure
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

  //******************************************** Applications ********************************************//
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
  getApplications: protectedProcedure.query(async ({ ctx }) => {
    try {
      const applications = await ctx.db.tutorApplication.findMany({
        include: { files: true },
        orderBy: { createdAt: "asc" },
      });

      if (!applications) return null;

      const users = await clerkClient.users.getUserList({
        userId: applications.map((application) => application.createdByClerkId),
      });

      if (!users) return null;

      const applicationsWithUser = applications.map((application) => {
        const user = users.find(
          (user) => user.id === application.createdByClerkId
        );
        return { ...application, user };
      });

      return applicationsWithUser;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: (error as Error).message,
      });
    }
  }),
  //******************************************** Application Status ********************************************//
  getUserApplicationStatus: protectedProcedure.query(async ({ ctx }) => {
    try {
      const application = await ctx.db.tutorApplication.findFirst({
        where: { createdByClerkId: ctx.auth.id },
        select: { status: true },
      });

      if (!application) return null;

      return application.status;
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

      //? Delete from UploadThing Server & Delete Entire Application with It's Files
      await Promise.all([
        utapi.deleteFiles(files.map((file) => file.key)),
        ctx.db.tutorApplication.delete({
          where: { applicationId },
        }),
      ]);
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: (error as Error).message,
      });
    }
  }),
  updateApplicationStatus: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        applicationId: z.string(),
        status: z.nativeEnum(STATUS),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { applicationId, status, userId } = input;
        await Promise.all([
          ctx.db.tutorApplication.update({
            where: { applicationId: applicationId },
            data: { status },
          }),
          status === STATUS.ACCEPTED &&
            clerkClient.users.updateUserMetadata(userId, {
              publicMetadata: { role: ROLE.TUTOR },
            }),
        ]);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
});
