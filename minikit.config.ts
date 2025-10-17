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
    subtitle: "Upload invoice, get loan, instantly",
    description: "Blink Finance is a platform that allows you to get a loan based on your unpaid invoices.",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/blue-icon.png`,
    splashImageUrl: `${ROOT_URL}/blue-hero.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "finance",
    tags: ["finance", "lending", "borrowing", "invoicing"],
    heroImageUrl: `${ROOT_URL}/blue-hero.png`,
    tagline: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: `${ROOT_URL}/blue-hero.png`,
  },
} as const;