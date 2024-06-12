import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { RouterInputs } from "~/utils/api";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs";
import { PERIOD, ROLE, STATUS } from "~/utils/constants";
import dayjs from "dayjs";
import chunk from "~/utils/paginationChunk";

export type CreateAppointmentInput =
  RouterInputs["appointment"]["createAppointment"];

//TODO Fix filtering and sorting using GTE, LTE, ETC...
export const appointmentRouter = createTRPCRouter({
  getUserAppointments: protectedProcedure
    .input(
      z.object({
        period: z.nativeEnum(PERIOD),
        size: z.number().optional().default(5),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { period, size } = input;

        if (!period) return null;

        const { role } = ctx.auth.publicMetadata;

        const appointments = await ctx.db.appointment.findMany({
          where: {
            OR: [
              { studentClerkId: ctx.auth.id },
              { tutorClerkId: ctx.auth.id },
            ],
            status: { not: STATUS.CANCELLED },
          },
          orderBy:
            period !== PERIOD.PAST ? { date: "asc" } : { createdAt: "desc" },
        });

        if (!appointments) return null;

        const appointmentsWithUserInfo = await Promise.all(
          appointments.map(async (appointment) => {
            const { studentClerkId, tutorClerkId } = appointment;
            const userAppointmentsInfo = await clerkClient.users.getUser(
              role === ROLE.TUTOR ? studentClerkId : tutorClerkId
            );

            return {
              ...appointment,
              userAppointmentsInfo,
            };
          })
        );

        //*Seperate Today's Appointment, Upcoming Appointment, and Past Appointment
        const today = new Date();

        if (period === PERIOD.TODAY) {
          return chunk(
            appointmentsWithUserInfo.filter((appointment) => {
              const appointmentDate = new Date(appointment.date);
              return dayjs(appointmentDate).isSame(today, "day");
            }),
            size
          );
        }

        if (period === PERIOD.UPCOMING) {
          return chunk(
            appointmentsWithUserInfo.filter((appointment) => {
              const appointmentDate = new Date(appointment.date);
              return dayjs(appointmentDate).isAfter(today);
            }),
            size
          );
        }

        if (period === PERIOD.PAST) {
          return chunk(
            appointmentsWithUserInfo.filter((appointment) => {
              const appointmentDate = new Date(appointment.date);
              return dayjs(appointmentDate).isBefore(today);
            }),
            size
          );
        }
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
