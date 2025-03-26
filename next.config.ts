import type { NextConfig } from "next";
import dotenv from 'dotenv';

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
      {
        protocol: 'https',
        hostname: 'biometrico.itaguai.rj.gov.br', // ✅ Adicionando o domínio diretamente
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
