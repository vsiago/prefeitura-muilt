import type { NextConfig } from "next";
import dotenv from 'dotenv';

// Carrega as variáveis do arquivo .env
dotenv.config();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_HOST,
        port: process.env.NEXT_PUBLIC_PORT_1,
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_HOST,
        port: process.env.NEXT_PUBLIC_PORT_2,
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
