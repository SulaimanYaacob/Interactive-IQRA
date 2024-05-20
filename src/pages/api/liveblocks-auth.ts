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

  if (!user) return response.status(401).send("Unauthorized");

  const { status, body } = await liveblocks.identifyUser(
    { userId: user.id, groupIds: [] },
    {
      userInfo: {
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
        username: user.username ?? "",
        avatar: user?.imageUrl,
        email: user.emailAddresses[0]?.emailAddress,
      },
    }
  );

  response.status(status).send(body);
}
