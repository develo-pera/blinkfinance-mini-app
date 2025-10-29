import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { Nonce } from "@/models/Nonce";

const client = createPublicClient({
  chain: base,
  transport: http(),
});

// JWT secret - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, signature, messageString } = await request.json();

    const message = JSON.parse(messageString);

    console.log(message);

    if (!walletAddress) {
      return NextResponse.json({ message: "Wallet address is required" }, { status: 400 });
    }

    if (!signature || !message) {
      return NextResponse.json({ message: "Signature and message are required" }, { status: 400 });
    }

    if (!message.nonce) {
      return NextResponse.json({ message: "Inavlid nonce" }, { status: 400 });
    }

    const nonce = await Nonce.findOne({ nonce: message.nonce });
    if (!nonce) {
      return NextResponse.json({ message: "Invalid nonce" }, { status: 400 });
    }

    if (new Date(nonce.expiresAt).getTime() < Date.now()) {
      return NextResponse.json({ message: "Nonce expired" }, { status: 400 });
    }

    await Nonce.deleteOne({ nonce: message.nonce });

    const validSignature = await client?.verifyMessage({
      address: walletAddress,
      message: messageString,
      signature,
    });

    if (!validSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    // Because we're fetching this endpoint via `sdk.quickAuth.fetch`,
    // if we're in a mini app, the request will include the necessary `Authorization` header.
    // const authorization = request.headers.get("Authorization");

    // // Here we ensure that we have a valid token.
    // if (!authorization || !authorization.startsWith("Bearer ")) {
    //   return NextResponse.json({ message: "Missing token" }, { status: 401 });
    // }

    // try {
    //   // Now we verify the token. `domain` must match the domain of the request.
    //   // In our case, we're using the `getUrlHost` function to get the domain of the request
    //   // based on the Vercel environment. This will vary depending on your hosting provider.
    //   const payload = await client.verifyJwt({
    //     token: authorization.split(" ")[1] as string,
    //     domain: getUrlHost(request),
    //   });

    //   // If the token was valid, `payload.sub` will be the user's Farcaster ID.
    //   // This is guaranteed to be the user that signed the message in the mini app.
    //   const userFid = payload.sub;

    // Connect to database and find or create user
    await connectDB();
    let user = await User.findOne({ walletAddress: walletAddress });

    if (!user) {
      user = await User.create({ walletAddress });
    }

    // Generate JWT token for our API
    const jwtToken = jwt.sign(
      {
        userId: user.id.toString(),
        walletAddress: user.walletAddress,
      },
      JWT_SECRET,
      { expiresIn: '1y' } // Token expires in 1 year
    );

    // Return both the user data and the JWT token
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        fid: user.fid,
        username: user.username,
        displayName: user.displayName,
        pfpUrl: user.pfpUrl,
        bio: user.bio,
        email: user.email,
        walletAddress: user.walletAddress,
      },
      token: jwtToken
    });
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
      return NextResponse.json({ message: e.message }, { status: 500 });
    }

    throw e;
  }
}

// function getUrlHost(request: NextRequest) {
//   // First try to get the origin from the Origin header
//   const origin = request.headers.get("origin");
//   if (origin) {
//     try {
//       const url = new URL(origin);
//       return url.host;
//     } catch (error) {
//       console.warn("Invalid origin header:", origin, error);
//     }
//   }

//   // Fallback to Host header
//   const host = request.headers.get("host");
//   if (host) {
//     return host;
//   }

//   // Final fallback to environment variables
//   // let urlValue: string;
//   // if (process.env.VERCEL_ENV === "production") {
//   //   urlValue = process.env.NEXT_PUBLIC_URL!;
//   // } else if (process.env.VERCEL_URL) {
//   //   urlValue = `https://${process.env.VERCEL_URL}`;
//   // } else {
//   //   urlValue = "http://localhost:3000";
//   // }

//   const urlValue = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

//   const url = new URL(urlValue);
//   return url.host;
// }
