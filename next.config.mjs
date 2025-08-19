/** @type {import('next').NextConfig} */
const nextConfig = {
    // Image configuration for external domains
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**', // Allow all HTTPS domains
        },
        {
          protocol: 'http',
          hostname: '**', // Allow all HTTP domains for development
        }
      ],
      // Alternative: specify common image hosting domains
      // domains: [
      //   'images.unsplash.com',
      //   'via.placeholder.com', 
      //   'imgur.com',
      //   'i.imgur.com',
      //   'cloudinary.com',
      //   'res.cloudinary.com',
      //   'picsum.photos'
      // ]
    },
    
    // Silence warnings
    // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
    webpack: (config, { isServer }) => {
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
      
      // Additional optimizations to prevent ChunkLoadError
      if (!isServer) {
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            ...config.optimization.splitChunks,
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
              },
            },
          },
        };
      }
      
      return config;
    },
  };
  
  export default nextConfig;
  