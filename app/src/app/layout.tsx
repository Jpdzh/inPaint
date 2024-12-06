import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './provider';
import NavBar from './components/NavBar';
import { Link } from '@nextui-org/react';

export const metadata: Metadata = {
  title: 'InPaint',
  description: 'InPaint | 修复图片！',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='zh-CN'>
      <body className='min-h-screen font-sans antialiased'>
        <Providers>
          <div className='relative flex h-screen flex-col'>
            <NavBar />
            {children}
            <footer className='flex w-full flex-col p-4 gap-1 bg-gray-900'>
              <div className='flex items-center justify-center gap-3 '>
                <div className='flex items-center justify-center gap-1'>
                  <p className='text-large font-medium'>🎨</p>
                  <p className='text-small font-medium'>InPaint</p>
                </div>
              </div>
              <p className='flex items-center justify-center text-center text-tiny text-default-400 gap-1'>
                © {new Date().getFullYear()}
                <Link
                  href='https://github.com/Cierra-Runis'
                  isExternal
                  className='text-tiny'
                >
                  Cierra_Runis
                </Link>
                &
                <Link
                  href='https://github.com/Jpdzh'
                  isExternal
                  className='text-tiny'
                >
                  Jpdzh
                </Link>
              </p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
