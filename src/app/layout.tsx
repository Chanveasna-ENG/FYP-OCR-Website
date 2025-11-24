import './globals.css';
import { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { Crimson_Text, Inria_Serif } from 'next/font/google';

// Optimize fonts with next/font/google
const crimsonText = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-crimson',
  display: 'swap',
});

const inriaSerif = Inria_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-inria',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Khmer OCR Project',
  description: 'Unlocking Khmer Script through OCR technology.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${crimsonText.variable} ${inriaSerif.variable}`}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}