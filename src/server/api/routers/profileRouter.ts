import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs/server";

export const profileRouter = createTRPCRouter({
  //! Development Purposes
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const res = await clerkClient.users.updateUser(ctx.auth.id, {
        firstName: input.name,
      });
    }),
});
