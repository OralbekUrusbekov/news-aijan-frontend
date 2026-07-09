import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import { LocaleProvider } from '@/lib/i18n/LocaleContext';
import { AuthProvider } from '@/lib/auth/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' });
const manrope = Manrope({ subsets: ['latin', 'cyrillic'], variable: '--font-manrope' });

export const metadata: Metadata = {
  title: 'Ақпарат — Жаңалықтар порталы',
  description: 'Қазақстанның жетекші жаңалықтар порталы',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="kk" className={`h-full ${inter.variable} ${manrope.variable}`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900 antialiased font-sans">
        <LocaleProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
