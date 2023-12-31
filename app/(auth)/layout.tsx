import { ReactNode } from "react";

import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import "../globals.css";

export const metadata = {
  title: 'Threads',
  description: 'A Next.js 13 Meta Threads Application'
}

interface RootLayoutProps {
  children: ReactNode
}

const inter = Inter({ subsets: ['latin'] });

const RootLayout = ({children}: RootLayoutProps) => {
  return (
    <ClerkProvider >
      <html lang='en'>
        <body className={`${inter.className} bg-dark-1 w-full flex justify-center items-center h-screen`}>
						{children}
        </body>
      </html>
    </ClerkProvider>
  )
}

export default RootLayout;
