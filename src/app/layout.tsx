import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Smart Calculator',
  description: 'Voice-enabled calculator with custom shortcuts for business calculations',
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1, user-scalable=no',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}