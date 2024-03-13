import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "../components/ConvexClientProvider";
import Header from "@/components/shared/header";
import { ThemeProvider } from "@/components/theme-provider"

// convex = npx convex dev
// https://dashboard.convex.dev/t/felixesteban100/file-drive-69a04/quiet-cat-155/data?table=files

// nextjs = npm run dev 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <body className={inter.className}>
          <ConvexClientProvider>
            {/* <Header /> */}
            {children}
          </ConvexClientProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}
