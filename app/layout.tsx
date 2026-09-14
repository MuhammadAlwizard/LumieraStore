import './globals.css';
import { ReactNode } from 'react';
import Script from 'next/script';
export const metadata = { title: 'LUMIÉRA Shine — Shine in Every Shade', description: 'Premium hijab crafted to elevate your everyday elegance.' };
export default function RootLayout({ children }: { children: ReactNode }) { return <html lang="id"><body>{children}<Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} /></body></html>; }
