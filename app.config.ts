export const config = {
  onlyMiniApp: true,
  allowDemo: true,
  baseAppUrl: process.env.NEXT_PUBLIC_BASE_APP_URL || 'cbwallet://miniapp?url=https://blinkfinance-mini-app.netlify.app',
  farcasterAppUrl: process.env.NEXT_PUBLIC_FARCASTER_APP_URL || 'https://farcaster.xyz/miniapps/8z40gHY9unFY/blink-finance',
} as const;