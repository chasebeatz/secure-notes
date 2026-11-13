import { Suspense } from "react";
import ThemeToggle from "./theme-toggle";
import UnsavedGuard from "./unsaved-guard";
import InactivityGuard from "./inactivity-guard";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Secure Notes | Your teaching notebook",
  description: "A private workspace for teaching notes, student progress, and next steps.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head><script dangerouslySetInnerHTML={{__html: `(function(){try{var t=localStorage.getItem("secure-notes-theme");document.documentElement.dataset.theme=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"light"}catch(e){document.documentElement.dataset.theme=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}})()`}} /></head>
      <body className="min-h-full flex flex-col"><ThemeToggle/><UnsavedGuard/><div id="app-content">{children}</div><Suspense fallback={null}><InactivityGuard /></Suspense></body>
    </html>
  );
}
