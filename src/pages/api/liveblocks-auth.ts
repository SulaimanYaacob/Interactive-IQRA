import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import type { NextApiRequest, NextApiResponse } from "next";

const liveblocks = new Liveblocks({
  secret: String(process.env.LIVEBLOCKS_API_KEY),
});

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { userId } = getAuth(request);
  const user = userId ? await clerkClient.users.getUser(userId) : null;

  if (userId && !user) return response.status(401).send("Unauthorized");

  const { status, body } = await liveblocks.identifyUser(
    {
      userId: userId!,
      groupIds: [],
    },
    { userInfo: { name: user!.firstName!, avatar: user?.imageUrl } }
  );

  // Authorize the user and return the result
  response.status(status).send(body);
}
