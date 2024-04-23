import { Liveblocks } from "@liveblocks/node";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const liveblocks = new Liveblocks({ secret: process.env.LIVEBLOCKS_API_KEY! });

//TODO Generate a random room id when room is created.
export const liveblocksRouter = createTRPCRouter({
  createRoom: protectedProcedure.mutation(async ({ ctx, input }) => {
    await liveblocks.createRoom("123", {
      defaultAccesses: ["room:read", "room:presence:write"],
      usersAccesses: {
        [String(ctx.auth.emailAddresses[0]?.emailAddress)]: ["room:write"],
      },
    });
  }),
});
