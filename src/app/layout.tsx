import { DogProvider } from "@/components/providers/DogProvider"
import { BottomNav } from "@/components/layout/BottomNav"
import { Header } from "@/components/layout/Header"
import "./globals.css"

export const metadata = {
  title: "WanLog",
  description: "Manage your awesome 2 dogs, Mochi & Uni!",
  themeColor: "#ffffff",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="antialiased bg-neutral-50 text-neutral-900 pb-20 selection:bg-neutral-200">
        <DogProvider>
          <div className="max-w-md mx-auto min-h-[100dvh] bg-white shadow-xl shadow-neutral-200/50 relative overflow-hidden flex flex-col">
            <Header />
            <main className="flex-1 w-full flex flex-col pt-4 px-4 overflow-y-auto overflow-x-hidden">
              {children}
            </main>
            <BottomNav />
          </div>
        </DogProvider>
      </body>
    </html>
  )
}
