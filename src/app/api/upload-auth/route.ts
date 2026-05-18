import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  // Your application logic to authenticate the user
  // For example, you can check if the user is logged in or has the necessary permissions
  // If the user is not authenticated, you can return an error response

  const { token, expire, signature } = getUploadAuthParams({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.PRIVATE_KEY!,

    // expire: 30 * 60, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
    // token: "random-token", // Optional, a unique token for request
  });

  return Response.json({
    token,
    expire,
    signature,
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  });
}
