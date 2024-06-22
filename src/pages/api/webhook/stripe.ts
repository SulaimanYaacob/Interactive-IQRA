import { buffer } from "micro";
import { env } from "~/env.mjs";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs";
import { PRODUCT_TYPE } from "~/utils/constants";
import { db } from "~/server/db";
import type { APPOINTMENT_STATUS } from "@prisma/client";

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  request: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const requestBuffer = await buffer(request);
    const sig = request.headers["stripe-signature"]!;

    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-04-10",
    });

    const event = stripe.webhooks.constructEvent(
      requestBuffer.toString(),
      sig,
      webhookSecret
    );

    switch (event.type) {
      case "checkout.session.completed":
        const payment = event.data.object;

        if (payment.mode === "payment") {
          if (
            (payment?.metadata?.productType as PRODUCT_TYPE) ===
            PRODUCT_TYPE.IQRA
          ) {
            const userId = payment.metadata?.userId;
            const iqra = payment.metadata?.iqra;

            if (userId && [2, 3, 4, 5, 6].includes(Number(iqra))) {
              const privateMetadataKey = `iqra${iqra}`;
              await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                  [privateMetadataKey]: true,
                },
              });
            }
          } else if (
            payment?.metadata?.productType === PRODUCT_TYPE.APPOINTMENT
          ) {
            await db.appointment.create({
              data: {
                studentClerkId: payment.metadata?.studentClerkId ?? "",
                tutorClerkId: payment.metadata?.tutorClerkId ?? "",
                date: new Date(payment.metadata?.date ?? ""),
                startTime: payment.metadata?.startTime ?? "",
                endTime: payment.metadata?.endTime ?? "",
                comments: payment.metadata?.comments ?? "",
                status: payment.metadata?.status as APPOINTMENT_STATUS,
              },
            });
          }
        }

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
