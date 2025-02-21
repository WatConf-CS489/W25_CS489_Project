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
      <body>
        <RootQueryProvider>
          {children}
        </RootQueryProvider>
      </body>
    </html>
  );
}
