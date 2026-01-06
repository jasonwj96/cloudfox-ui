import type { Metadata } from "next";
import { Inter, Quicksand, Open_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});


export const metadata: Metadata = {
  title: "Cloudfox",
  description: "Cloudfox service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.className}`}>
        {children}
      </body>
    </html>
  );
}
