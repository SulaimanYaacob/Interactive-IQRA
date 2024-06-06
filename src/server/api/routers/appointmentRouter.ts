import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { RouterInputs } from "~/utils/api";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs";

export type CreateAppointmentInput =
  RouterInputs["appointment"]["createAppointment"];

export const appointmentRouter = createTRPCRouter({
  getUserAppointments: protectedProcedure.query(async ({ ctx }) => {
    try {
      const appointments = await ctx.db.appointment.findMany({
        where: {
          OR: [{ studentClerkId: ctx.auth.id }, { tutorClerkId: ctx.auth.id }],
        },
      });

      if (!appointments) return null;

      const appointmentsWithUserInfo = await Promise.all(
        appointments.map(async (appointment) => {
          const { studentClerkId, tutorClerkId } = appointment;
          const [studentInfo, tutorInfo] = await Promise.all([
            clerkClient.users.getUser(studentClerkId),
            clerkClient.users.getUser(tutorClerkId),
          ]);

          return {
            ...appointment,
            studentInfo,
            tutorInfo,
          };
        })
      );

      return appointmentsWithUserInfo;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: (error as Error).message,
      });
    }
  }),
  createAppointment: protectedProcedure
    .input(
      z.object({
        tutorClerkId: z.string(),
        date: z.date().optional().default(new Date()),
        startTime: z.string(),
        endTime: z.string(),
        comments: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.appointment.create({
          data: {
            studentClerkId: ctx.auth.id,
            status: "PENDING",
            ...input,
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
