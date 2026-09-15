import './globals.css';
import { ReactNode } from 'react';
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

export const metadata = { title: 'LUMIÉRA Shine — Shine in Every Shade', description: 'Premium hijab crafted to elevate your everyday elegance.' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${display.variable} ${sans.variable}`}>
      <body>
        {children}
        <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} />
      </body>
    </html>
  );
}
