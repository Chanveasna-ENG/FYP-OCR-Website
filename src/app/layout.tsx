import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Khmer OCR Project',
  description: 'Unlocking Khmer Script through OCR technology.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;700&family=Inria+Serif:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
