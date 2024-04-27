import { Liveblocks } from "@liveblocks/node";
import { TRPCError } from "@trpc/server";
import { string, z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const liveblocks = new Liveblocks({
  secret: String(process.env.LIVEBLOCKS_API_KEY),
});

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
  getCurrentUserRoomAccess: protectedProcedure
    .input(z.object({ roomId: string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { roomId } = input;
        const room = await liveblocks.getRoom(roomId);

        if (!room) return;

        //*If user have multiple emails
        const emailAddresses = ctx.auth.emailAddresses.map(
          ({ emailAddress }) => emailAddress
        );

        const userAccess = room.usersAccesses[String(...emailAddresses)];

        return userAccess;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
  searchingRoom: protectedProcedure
    .input(z.object({ roomId: string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { roomId } = input;
        const room = await liveblocks.getRoom(roomId);

        if (!room) return;

        //* Check if user already joined the room or not. If not, update the user access
        //* Only primary email is being stored in the database
        if (
          !room.usersAccesses[String(ctx.auth.emailAddresses[0]?.emailAddress)]
        ) {
          await liveblocks.updateRoom(roomId, {
            usersAccesses: {
              ...room.usersAccesses,
              [String(ctx.auth.emailAddresses[0]?.emailAddress)]: [
                "room:read",
                "room:presence:write",
              ],
            },
          });
        }

        return room;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
  createRoom: protectedProcedure
    .input(z.object({ maxUsers: z.number().default(10) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { maxUsers } = input;
        const roomId = generateUniqueID();

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
