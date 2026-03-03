import { DogProvider } from "@/components/providers/DogProvider"
import { WalkProvider } from "@/components/providers/WalkProvider"
import { BottomNav } from "@/components/layout/BottomNav"
import { Header } from "@/components/layout/Header"
import "./globals.css"

export const metadata = {
  title: "WanLog",
  description: "Manage your awesome 2 dogs, Mochi & Uni!",
}

export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "resizes-visual",
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
          <WalkProvider>
            <div className="max-w-md mx-auto h-[100dvh] bg-white shadow-xl shadow-neutral-200/50 relative overflow-hidden flex flex-col">
              <Header />
              <main className="flex-1 w-full flex flex-col pt-4 px-4 overflow-y-auto overflow-x-hidden pb-safe pb-24">
                {children}
              </main>
              <BottomNav />
            </div>
          </WalkProvider>
        </DogProvider>
      </body>
    </html>
  )
}
