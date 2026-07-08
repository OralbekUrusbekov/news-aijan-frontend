import type { Metadata } from 'next';
import './globals.css';
import { LocaleProvider } from '@/lib/i18n/LocaleContext';
import { AuthProvider } from '@/lib/auth/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Ақпарат — Жаңалықтар порталы',
  description: 'Қазақстанның жетекші жаңалықтар порталы',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="kk" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 antialiased">
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
