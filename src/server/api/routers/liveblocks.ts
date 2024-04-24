import { Liveblocks } from "@liveblocks/node";
import { string, z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const liveblocks = new Liveblocks({ secret: process.env.LIVEBLOCKS_API_KEY! });

function generateUniqueID(): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";

  for (let i = 0; i < 6; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return id;
}

export const liveblocksRouter = createTRPCRouter({
  //* Get User's Rooms
  checkRoomIsJoined: protectedProcedure
    .input(z.object({ roomId: string() }))
    .query(async ({ ctx, input }) => {
      const { roomId } = input;

      const prismaUserJoinedRoom = await ctx.db.room.findUnique({
        where: { id: ctx.auth.id, roomId },
      });

      if (prismaUserJoinedRoom) return true;

      return false;
    }),

  createRoom: protectedProcedure
    .input(z.object({ maxUsers: z.number().default(10) }))
    .mutation(async ({ ctx, input }) => {
      const { maxUsers } = input;
      const roomId = generateUniqueID();

      try {
        const liveblocksRoom = await liveblocks.createRoom(roomId, {
          defaultAccesses: ["room:read", "room:presence:write"],
          usersAccesses: {
            [String(ctx.auth.emailAddresses[0]?.emailAddress)]: ["room:write"],
          },
        });

        const primsaRoom = await ctx.db.room.create({
          data: {
            id: ctx.auth.id,
            maxUsers,
            roomId,
          },
        });

        return { liveblocksRoom, primsaRoom };
      } catch (error) {}
    }),
});
