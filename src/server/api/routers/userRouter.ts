import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
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
});
