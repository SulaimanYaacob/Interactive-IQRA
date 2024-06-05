import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { RouterInputs } from "~/utils/api";

export type CreateAppointmentInput =
  RouterInputs["appointment"]["createAppointment"];

export const appointmentRouter = createTRPCRouter({
  createAppointment: protectedProcedure
    .input(
      z.object({
        date: z.date().optional().default(new Date()),
        startTime: z.string(),
        endTime: z.string(),
        comments: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.appointment.create({
        data: {
          studentClerkId: ctx.auth.id,
          status: "PENDING",
          ...input,
        },
      });
    }),
});
