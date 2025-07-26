import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "./ConvexClientProvider";

export const metadata: Metadata = {
  title: {
    template: "%s | Don't Forget",
    default: "Don't Forget : Tasks and Issues Tracker",
  },
  description: "A task and issue tracker build to solve all your problems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html
        className={`${GeistSans.variable} ${GeistMono.variable}`}
        lang="en"
        suppressHydrationWarning
      >
        <body>
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              disableTransitionOnChange
              enableSystem
            >
              {children}
              <Toaster closeButton richColors />
              <Analytics />
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
