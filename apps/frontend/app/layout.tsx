import type { Metadata } from "next";
import { Comic_Neue} from "next/font/google";
import "./globals.css";

const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-comic-neue  ",
});


export const metadata: Metadata = {
  title: "Global PDF Services",
  description: "Global PDF Services is a platform that allows you to translate PDF files into multiple languages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${comicNeue.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
