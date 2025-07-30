import withPWAInit from "next-pwa";

/** @type {import('next').NextConfig} */
const withPWA = withPWAInit({
  dest: "public",
  mode: "production",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // o limita a dominios específicos como 'lh3.googleusercontent.com'
      },
    ],
  },
  i18n: {
    locales: ["en", "es"],
    defaultLocale: "en",
  }, env: {
    API_ENDPOINT: process.env.API_ENDPOINT,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    AUTH_DEBUG: process.env.AUTH_DEBUG,
    EXPIRE_SESSION: process.env.EXPIRE_SESSION,
  },
  async headers() {
    return [
      {
        // Aplicar encabezados a todas las rutas y prefijos de idioma automáticamente
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'nonce-randomhash'; style-src 'self'; frame-ancestors 'self'; form-action 'self';",
          },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
        ],
      },
    ];
  },

};

export default withPWA(nextConfig);