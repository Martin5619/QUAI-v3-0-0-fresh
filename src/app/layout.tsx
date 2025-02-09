import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { cn } from '@/lib/utils'
import NavBar from '@/components/navigation/NavBar'
import { auth } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'QUAi',
  description: 'AI-powered question generation from your documents',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <Providers session={session}>
          <div className="relative flex min-h-screen flex-col">
            <div className="sticky top-0 z-50 w-full">
              <NavBar session={session} />
            </div>
            <main className="flex-1">
              <Toaster richColors />
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
