import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";
import NavBar from "./components/NavBar";
import { Divider, Link } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InPaint",
  description: "InPaint | 修复图片！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='zh-CN'>
      <body className={inter.className}>
        <Providers>
          <NavBar />
          {children}
          <footer className='flex w-full flex-col p-4 gap-1'>
            <div className='flex items-center justify-center gap-3 '>
              <div className='flex items-center justify-center gap-1'>
                <p className='text-large font-medium'>🎨</p>
                <p className='text-small font-medium'>InPaint</p>
              </div>
              {/* <div className='inline-flex items-center justify-between'>
                <span className='w-2 h-2 ml-1 rounded-full bg-success' />
                <span className='flex-1 text-default-400 font-normal px-2'>
                  All systems operational
                </span>
              </div> */}
            </div>
            <p className='flex items-center justify-center text-center text-tiny text-default-400 gap-1'>
              © {new Date().getFullYear()}
              <Link href='https://github.com/Cierra-Runis' isExternal>
                Cierra_Runis
              </Link>
              &
              <Link href='https://github.com/Jpdzh' isExternal>
                Jpdzh
              </Link>
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
