import './globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Cormorant_Garamond, Jost } from 'next/font/google';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
});

const title = 'LUMIÉRA Shine — Shine in Every Shade';
const description = 'Premium hijab crafted to elevate your everyday elegance.';

export const metadata: Metadata = {
  metadataBase: new URL('https://lumierastore.online'),
  title,
  description,
  openGraph: {
    title,
    description,
    url: 'https://lumierastore.online',
    siteName: 'LUMIÉRA Shine',
    images: [{ url: '/branding/hero-tag.jpg', width: 1170, height: 1464 }],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/branding/hero-tag.jpg'],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${display.variable} ${sans.variable}`}>
      <body>
        {children}
        {process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY && (
          <Script
            src={process.env.MIDTRANS_IS_PRODUCTION === 'true' ? 'https://app.midtrans.com/snap/snap.js' : 'https://app.sandbox.midtrans.com/snap/snap.js'}
            data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          />
        )}
      </body>
    </html>
  );
}
