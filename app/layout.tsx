import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { APP_NAME, PRIMARY_COLOR } from "@/lib/config";

export const metadata: Metadata = {
  title: `${APP_NAME} | Cloud Video Search`,
  description: "Search cloud and developer learning videos through a secure server-side YouTube proxy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[var(--app-bg)] text-slate-900">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 top-0 h-72 opacity-70"
          style={{
            background: `radial-gradient(circle at top, ${PRIMARY_COLOR}22, transparent 62%)`,
          }}
        />
        <div className="relative flex min-h-screen flex-col">
          <header className="border-b border-white/60 bg-white/75 backdrop-blur">
            <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div />

              <Link href="/" className="justify-self-center">
                <span className="text-2xl font-semibold uppercase tracking-[0.2em] text-slate-950">
                  {APP_NAME}
                </span>
              </Link>

              <nav className="flex items-center justify-self-end gap-3 text-sm font-medium text-slate-600">
                <Link href="/" className="rounded-full px-3 py-2 transition hover:bg-slate-100">
                  Home
                </Link>
              </nav>
            </div>
          </header>

          <div className="flex-1">{children}</div>

          <footer className="mt-10 border-t border-slate-200/80 bg-white/70">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-6 text-sm text-slate-500 sm:px-6 lg:px-8">
              <p>
                (c) {currentYear} {APP_NAME}
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
