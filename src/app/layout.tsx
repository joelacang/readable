import "~/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "react-hot-toast";
import DialogProvider from "~/providers/dialog-provider";
import SheetProvider from "~/providers/sheet-provider";

export const metadata: Metadata = {
  title: "readable",
  description: "Read some stories here.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>
          <Toaster />
          <DialogProvider />
          <SheetProvider />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
