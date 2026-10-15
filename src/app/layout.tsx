import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ToastProvider } from '@/components/ui/Toast';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: `${SITE_NAME} | Gifts, Home Decor & Fine Accents | Vehari, Pakistan`,
  description: SITE_DESCRIPTION,
  keywords: [
    'gift shop Vehari',
    'home decor Pakistan',
    'tissue boxes',
    'decorative vases',
    'wall frames Vehari',
    'botanical plants',
    'Afshan Gift Centre',
  ],
  authors: [{ name: 'Afshan Gift Centre' }],
  openGraph: {
    title: `${SITE_NAME} | Gifts, Home Decor & Fine Accents | Vehari, Pakistan`,
    description: SITE_DESCRIPTION,
    url: 'https://afshangiftcentre.com',
    siteName: SITE_NAME,
    locale: 'en_PK',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FAFAF7] text-[#3D3229] font-sans selection:bg-[#B8956A]/20 selection:text-[#2C2C2C]">
        <ToastProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
