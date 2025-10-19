"use client";

import { Button } from "@/components/ui/button";
import sdk from "@farcaster/miniapp-sdk";

const SignInPage = () => {
  return (
    <div>
      <h1>Sign In</h1>
      <Button onClick={async () => {
        console.log("Sign in button clicked");
        const token = await sdk.quickAuth.getToken();
        console.log("token", token);
      }}>
        Sign In
      </Button>
    </div>
  );
};

export default SignInPage;