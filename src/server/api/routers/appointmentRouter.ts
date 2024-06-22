import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { RouterInputs, RouterOutputs } from "~/utils/api";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs";
import {
  APPOINTMENT_STATUS,
  PERIOD,
  PRODUCT_TYPE,
  ROLE,
} from "~/utils/constants";
import dayjs from "dayjs";
import chunk from "~/utils/paginationChunk";
import Stripe from "stripe";
import { env } from "~/env.mjs";

export type GetUserAppointmentOutput =
  RouterOutputs["appointment"]["getUserAppointments"];
export type CreateAppointmentInput =
  RouterInputs["appointment"]["createAppointmentCheckoutSession"];
export type CancelAppointmentInput =
  RouterInputs["appointment"]["cancelAppointment"];

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
            status:
              period !== PERIOD.PAST
                ? { not: APPOINTMENT_STATUS.CANCELLED }
                : {},
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
              return (
                dayjs(appointmentDate).isBefore(today) ||
                appointment.status === APPOINTMENT_STATUS.CANCELLED
              );
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
  createAppointmentCheckoutSession: protectedProcedure
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
        const url = env.URL;
        const stripe = new Stripe(String(env.STRIPE_SECRET_KEY), {
          apiVersion: "2024-04-10",
        });
        const { date, endTime, startTime, tutorClerkId, comments } = input;

        const tutorDetails = await clerkClient.users.getUser(tutorClerkId);
        if (!tutorDetails) throw new Error("Tutor not found");
        const { firstName, lastName } = tutorDetails;

        const checkoutSession = await stripe.checkout.sessions.create({
          mode: "payment",
          payment_method_types: ["card"],
          line_items: [
            {
              quantity: 1,
              price_data: {
                currency: "MYR",
                unit_amount: 5000,
                product_data: {
                  name: `Appointment with ${firstName ?? ""} ${lastName ?? ""}`,
                  description: `On ${dayjs(date).format(
                    "DD MMM YYYY"
                  )} From ${startTime} to ${endTime}`,
                },
              },
            },
          ],
          success_url: `${url}/profile/${tutorClerkId}`,
          cancel_url: `${url}/profile/${tutorClerkId}`,
          metadata: {
            studentClerkId: ctx.auth.id,
            tutorClerkId: tutorClerkId,
            date: date.toDateString(),
            startTime: startTime,
            endTime: endTime,
            comments: comments ?? null,
            status: APPOINTMENT_STATUS.PENDING,
            productType: PRODUCT_TYPE.APPOINTMENT,
          },
        });

        // await ctx.db.appointment.create({
        //   data: {
        //     studentClerkId: ctx.auth.id,
        //     status: "PENDING",
        //     ...input,
        //   },
        // });
        return checkoutSession.url;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
  cancelAppointment: protectedProcedure
    .input(
      z.object({
        appointmentId: z.string(),
        cancelReason: z.string().max(300).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { appointmentId } = input;
      await ctx.db.appointment.update({
        where: { appointmentId },
        data: { status: APPOINTMENT_STATUS.CANCELLED },
      });
    }),
});
