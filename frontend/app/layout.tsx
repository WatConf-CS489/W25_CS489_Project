import type { Metadata } from "next";
import "./globals.css";
import RootQueryProvider from "@/components/RootQueryProvider";

export const metadata: Metadata = {
  title: "WatConfessions",
  description: "Waterloo Confessions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          http-equiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
        />
      </head>
      <body>
        <RootQueryProvider>{children}</RootQueryProvider>
      </body>
    </html>
  );
}
