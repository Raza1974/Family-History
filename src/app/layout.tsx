import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Family Tree App",
  description: "A mobile app for managing family trees",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-blue-500 p-4 text-white">
          <h1 className="text-2xl font-bold">Family Tree App</h1>
        </header>
        <main className="p-4">{children}</main>
        <footer className="bg-gray-200 p-4 text-center">
          <p>&copy; 2023 Family Tree App</p>
        </footer>
      </body>
    </html>
  )
}

