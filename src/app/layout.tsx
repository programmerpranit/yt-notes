import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Youtube Notes",
  description: "Generate Notes from Youtube Videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
