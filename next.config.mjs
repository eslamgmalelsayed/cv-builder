/** @type {import('next').NextConfig} */
const nextConfig = {
  // Netlify will handle deployment - removed static export to enable API routes
  // output: "export", // Commented out to enable API routes
  trailingSlash: true,
  skipTrailingSlashRedirect: true,

  // Image optimization
  images: {
    unoptimized: true,
    domains: ["fonts.googleapis.com", "fonts.gstatic.com"],
  },

  // Font optimization
  optimizeFonts: true,

  // Experimental features
  experimental: {
    // optimizeCss: true, // Disabled due to critters module issues
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // Webpack configuration for better performance
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: "vendor",
            chunks: "all",
            test: /node_modules/,
            priority: 20,
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }

    // Font loading optimization
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: "asset/resource",
      generator: {
        filename: "static/fonts/[name].[hash][ext]",
      },
    });

    return config;
  },

  // Headers for better performance and security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/cv-builder",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // PoweredByHeader
  poweredByHeader: false,

  // Compression
  compress: true,

  // Generate ETags
  generateEtags: true,

  // React strict mode
  reactStrictMode: true,

  // SWC minification
  swcMinify: true,

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
