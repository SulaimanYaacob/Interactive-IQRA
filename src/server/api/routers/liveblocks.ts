import { z } from "zod";
import { Liveblocks } from "@liveblocks/node";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const liveblocks = new Liveblocks({ secret: process.env.LIVEBLOCKS_API_KEY! });

//TODO Generate a random room id when room is created.
export const postRouter = createTRPCRouter({
  createRoom: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const room = await liveblocks.createRoom("123", {
        defaultAccesses: [],
        usersAccesses: {
          [String(ctx.auth.emailAddresses[0]?.emailAddress)]: [
            "room:read",
            "room:presence:write",
          ],
        },
      });
    }),
});
