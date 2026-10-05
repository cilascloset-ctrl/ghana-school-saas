import './globals.css';
import type { Metadata } from 'next';
import RegisterSW from '@/components/RegisterSW';

export const metadata: Metadata = {
  title: 'EduLink Ghana',
  description: 'Offline-first SaaS school management system for Ghanaian schools',
  manifest: '/manifest.webmanifest'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><RegisterSW />{children}</body></html>;
}
