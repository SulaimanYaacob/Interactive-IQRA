import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { RouterInputs } from "~/utils/api";

export type EditProfileInput = RouterInputs["user"]["editUserProfile"];

export const userRouter = createTRPCRouter({
  getProfileById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      try {
        const { userId } = input;
        const user = await clerkClient.users.getUser(userId);

        if (!user)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });

        return user;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
  getAllProfile: protectedProcedure.query(async () => {
    try {
      const users = await clerkClient.users.getUserList({});
      return users;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: (error as Error).message,
      });
    }
  }),
  getCurrentUserRole: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await clerkClient.users.getUser(ctx.auth.id);
      return user.publicMetadata.role;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: (error as Error).message,
      });
    }
  }),
  editUserProfile: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string().optional(),
        username: z.string(),
        bio: z.string().optional(),
        // profileImage: z.custom<Blob | File | string | null>(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { firstName, lastName, bio, username } = input;

        await clerkClient.users.updateUser(ctx.auth.id, {
          firstName,
          lastName,
          username,
          publicMetadata: {
            ...ctx.auth.publicMetadata,
            bio,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
});
