"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";

const Test = () => {
  const { context } = useMiniKit();
  console.log("context", context);
  console.log("context client fid", context?.client.clientFid);

  return (
    <p>Test</p>
  );
};

export default Test;