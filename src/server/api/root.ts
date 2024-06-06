import { roomRouter } from "~/server/api/routers/room";
import { createTRPCRouter } from "~/server/api/trpc";
import { liveblocksRouter } from "./routers/liveblocksRouter";
import { tutorRouter } from "./routers/tutorRouter";
import { userRouter } from "./routers/userRouter";
import { appointmentRouter } from "./routers/appointmentRouter";
import { stripeRouter } from "./routers/stripeRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  room: roomRouter,
  user: userRouter,
  tutor: tutorRouter,
  stripe: stripeRouter,
  appointment: appointmentRouter,
  liveblocks: liveblocksRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
