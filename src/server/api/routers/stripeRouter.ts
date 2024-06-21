import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import Stripe from "stripe";
import { TRPCError } from "@trpc/server";
import type { ClerkPrivateMetadata } from "~/types/privateMetadata";
import { PRODUCT_TYPE } from "~/utils/constants";

export const stripeRouter = createTRPCRouter({
  getIqraProductCheckoutURL: protectedProcedure.query(async ({ ctx }) => {
    try {
      const stripe = new Stripe(String(env.STRIPE_SECRET_KEY), {
        apiVersion: "2024-04-10",
      });

      const url = env.URL;

      async function createCheckoutSession(iqraType: number, priceId: string) {
        return await stripe.checkout.sessions.create({
          mode: "payment",
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          success_url: `${url}/st/learn-iqra`,
          cancel_url: `${url}/st/learn-iqra`,
          metadata: {
            userId: ctx.auth.id,
            iqra: iqraType,
            productType: PRODUCT_TYPE.IQRA,
          },
        });
      }

      const checkoutSessionIqra2 = await createCheckoutSession(
        2,
        env.STRIPE_IQRA2_PRICE_ID
      );
      const checkoutSessionIqra3 = await createCheckoutSession(
        3,
        env.STRIPE_IQRA3_PRICE_ID
      );

      const { iqra2, iqra3 } = ctx.auth.privateMetadata as ClerkPrivateMetadata;
      const listProductSession = [
        {
          productName: "iqra 1",
          paid: true,
          checkoutUrl: "/st/iqra-1/1",
        },
        {
          productName: "iqra 2",
          paid: iqra2,
          checkoutUrl: checkoutSessionIqra2.url,
        },
        {
          productName: "iqra 3",
          paid: iqra3,
          checkoutUrl: checkoutSessionIqra3.url,
        },
      ];

      return listProductSession;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create checkout session",
      });
    }
  }),
  createAppointmentCheckoutSession: protectedProcedure
    // .input(
    //   z.object({
    //     tutorClerkId: z.string(),
    //     date: z.date().optional().default(new Date()),
    //     startTime: z.string(),
    //     endTime: z.string(),
    //     comments: z.string().optional(),
    //   })
    // )
    .mutation(async ({ ctx, input }) => {
      try {
        const stripe = new Stripe(String(env.STRIPE_SECRET_KEY), {
          apiVersion: "2024-04-10",
        });
        const url = env.URL;

        const checkoutSession = await stripe.checkout.sessions.create({
          mode: "payment",
          line_items: [
            {
              quantity: 1,
              price_data: {
                currency: "MYR",
                unit_amount: 5000,
                product_data: {
                  name: "Appointment",
                },
              },
            },
          ],
          success_url: `${url}/dummy`,
          cancel_url: `${url}/dummy`,
          metadata: {
            userId: ctx.auth.id,
          },
        });

        console.log("=>", checkoutSession);

        return checkoutSession.url;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
});
