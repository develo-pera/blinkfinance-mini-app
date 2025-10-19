const ROOT_URL =
  process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "eyJmaWQiOjUzNDcsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg0NjkxNjQwZjE0NzZmNWFDM2JjQ0UwM2Y0QkI2MDM5MDUyNGU1ZDk0In0",
    payload: "eyJkb21haW4iOiJibGlua2ZpbmFuY2UtbWluaS1hcHAubmV0bGlmeS5hcHAifQ",
    signature: "Zh9zOmfUBVXkKEd4/sJ+UYm0IY5+rzhwh1ylRFY0Px1na87HRHZMNm/74gDmpOUp9QvmymKnm0j3lMjNPJWO0Bw="
  },
  miniapp: {
    version: "1",
    name: "Blink Finance",
    subtitle: "Upload invoices. Get cash.",
    description: "Say goodbye to waiting on payments. Blink Finance gives you instant access to cash from your invoices.",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.jpg`],
    iconUrl: `${ROOT_URL}/miniapp-icon.jpg`,
    splashImageUrl: `${ROOT_URL}/miniapp-icon.jpg`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "finance",
    tags: ["finance", "lending", "borrowing", "invoicing"],
    heroImageUrl: `${ROOT_URL}/miniapp-hero.jpg`,
    tagline: "Upload invoices. Get cash.",
    ogTitle: "Upload invoices. Get cash.",
    ogDescription: "Fast and simple financing for your unpaid invoices.",
    ogImageUrl: `${ROOT_URL}/miniapp-hero.jpg`,
    // noindex: true,
  },
} as const;