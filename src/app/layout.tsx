import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import Header from "././components/Header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Family Tree App",
  description: "A comprehensive family tree management application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="container mx-auto p-4">{children}</main>
        <footer className="bg-gray-200 p-4 text-center mt-8">
          <p>&copy; 2023 Family Tree App</p>
        </footer>
      </body>
    </html>
  )
}

