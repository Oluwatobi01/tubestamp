import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TubeStamp',
  description: 'Generate YouTube timestamps quickly',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-950">
      <body className="min-h-full text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
