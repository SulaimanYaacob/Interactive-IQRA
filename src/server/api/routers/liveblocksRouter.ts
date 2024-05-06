import { Liveblocks } from "@liveblocks/node";
import { TRPCError } from "@trpc/server";
import { string, z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import type { RouterInputs } from "~/utils/api";

//* CreateRoom
export type CreateRoomInput = RouterInputs["liveblocks"]["createRoom"];

const liveblocks = new Liveblocks({
  secret: String(process.env.LIVEBLOCKS_API_KEY),
});

function generatePinNumber(): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";

  for (let i = 0; i < 6; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return id;
}

export const liveblocksRouter = createTRPCRouter({
  getCurrentRoomDetails: protectedProcedure
    .input(z.object({ roomId: string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { roomId } = input;
        const currentRoom = await ctx.db.room.findUnique({
          where: { roomId },
        });

        return currentRoom;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
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
    .input(z.object({ roomPIN: string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { roomPIN } = input;

        const prismaRoom = await ctx.db.room.findUnique({
          where: {
            roomPIN,
          },
        });

        if (!prismaRoom) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Room not found",
          });
        }

        const room = await liveblocks.getRoom(prismaRoom.roomId);

        if (!room) return;

        //* Check if user already joined the room or not. If not, update the user access
        //* Only primary email is being stored in the database
        if (
          !room.usersAccesses[String(ctx.auth.emailAddresses[0]?.emailAddress)]
        ) {
          await liveblocks.updateRoom(prismaRoom.roomId, {
            usersAccesses: {
              ...room.usersAccesses,
              [String(ctx.auth.emailAddresses[0]?.emailAddress)]: [
                "room:read",
                "room:presence:write",
              ],
            },
          });
        }

        return room; //TODO Instead of returning room,
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
  createRoom: protectedProcedure
    .input(z.object({ maxUsers: z.number().default(10), iqraBook: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { maxUsers, iqraBook } = input;

        const prismaRoom = await ctx.db.room.create({
          data: {
            createdByClerkId: ctx.auth.id,
            roomPIN: generatePinNumber(),
            maxUsers,
            iqraBook,
          },
        });

        const liveblocksRoom = await liveblocks.createRoom(
          String(prismaRoom.roomId),
          {
            defaultAccesses: ["room:read", "room:presence:write"],
            usersAccesses: {
              [String(ctx.auth.emailAddresses[0]?.emailAddress)]: [
                "room:write",
              ],
            },
          }
        );

        return { liveblocksRoom, prismaRoom };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
  //!For Development Purpose
  deleteRoom: protectedProcedure
    .input(z.object({ roomId: string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { roomId } = input;

        await liveblocks.deleteRoom(roomId); //? FYI, No Data Retrieve from deleting room

        const prismaRoom = await ctx.db.room.delete({
          where: {
            roomId,
          },
        });
        return prismaRoom;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
});
