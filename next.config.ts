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
      {
        protocol: 'https', // Se o seu link de imagem for HTTP, use 'http'
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com', // Novo domínio
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
