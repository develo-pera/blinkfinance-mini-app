const ROOT_URL =
  process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    "header": "",
    "payload": "",
    "signature": ""
  },
  miniapp: {
    version: "1",
    name: "Blink Finance",
    subtitle: "Upload invoice. Get cash.",
    description: "Say goodbye to waiting on payments. Blink Finance gives you instant access to cash from your invoices.",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.jpg`],
    iconUrl: `${ROOT_URL}/miniapp-icon.jpg`,
    splashImageUrl: `${ROOT_URL}/miniapp-hero.jpg`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "finance",
    tags: ["finance", "lending", "borrowing", "invoicing"],
    heroImageUrl: `${ROOT_URL}/miniapp-hero.jpg`,
    tagline: "Upload invoice. Get cash.",
    ogTitle: "Upload invoice. Get cash.",
    ogDescription: "Fast and simple financing for your unpaid invoices.",
    ogImageUrl: `${ROOT_URL}/miniapp-hero.jpg`,
  },
} as const;