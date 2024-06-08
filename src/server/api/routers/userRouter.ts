import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { RouterInputs } from "~/utils/api";
import { daysObject } from "~/utils/constants";

export type EditProfileDetailInput = RouterInputs["user"]["editProfileDetail"];
export type EditProfileAvailabilityInput =
  RouterInputs["user"]["editProfileAvailability"];

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
  editProfileDetail: protectedProcedure
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
  editProfileAvailability: protectedProcedure
    .input(
      z.object({
        mondayAvailability: z.boolean(),
        tuesdayAvailability: z.boolean(),
        wednesdayAvailability: z.boolean(),
        thursdayAvailability: z.boolean(),
        fridayAvailability: z.boolean(),
        saturdayAvailability: z.boolean(),
        sundayAvailability: z.boolean(),
        mondayStart: z.string().nullable(),
        mondayEnd: z.string().nullable(),
        tuesdayStart: z.string().nullable(),
        tuesdayEnd: z.string().nullable(),
        wednesdayStart: z.string().nullable(),
        wednesdayEnd: z.string().nullable(),
        thursdayStart: z.string().nullable(),
        thursdayEnd: z.string().nullable(),
        fridayStart: z.string().nullable(),
        fridayEnd: z.string().nullable(),
        saturdayStart: z.string().nullable(),
        saturdayEnd: z.string().nullable(),
        sundayStart: z.string().nullable(),
        sundayEnd: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { ...data } = input;

      console.log(data);

      //* if no availability is selected, set time to null
      Object.keys(daysObject).forEach((day) => {
        const availabilityKey = `${day}Availability` as keyof typeof data;
        const startKey = `${day}Start` as keyof typeof data;
        const endKey = `${day}End` as keyof typeof data;

        if (!data[availabilityKey]) {
          (data[startKey] as null) = null;
          (data[endKey] as null) = null;
        }
      });

      const allAvailabilityFalse = Object.keys(daysObject).every(
        (day) => !input[`${day}Availability` as keyof typeof input]
      );

      await clerkClient.users.updateUser(ctx.auth.id, {
        publicMetadata: {
          ...ctx.auth.publicMetadata,
          availability: !allAvailabilityFalse ? data : null,
        },
      });
    }),
});
