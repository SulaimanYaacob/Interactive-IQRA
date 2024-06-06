import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import Stripe from "stripe";
import { TRPCError } from "@trpc/server";

export const stripeRouter = createTRPCRouter({
  getProducts: protectedProcedure.query(async ({ ctx }) => {
    const stripe = new Stripe(String(env.STRIPE_SECRET_KEY), {
      apiVersion: "2024-04-10",
    });

    const url = env.URL;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: env.STRIPE_IQRA2_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${url}/success`,
      cancel_url: `${url}/st/learn-iqra`,
      metadata: {
        userId: ctx.auth.id,
      },
    });

    if (!checkoutSession.url) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create checkout session",
      });
    }

    return { url: checkoutSession.url };
  }),
});
