import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const appointmentRouter = createTRPCRouter({
  createAppointment: protectedProcedure.input(z.object({})).mutation(() => {
    return;
  }),
});
