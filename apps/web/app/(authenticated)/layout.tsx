import AuthWrapper from "../../components/AuthWrapper"
import QueryWrapper from "../../components/QueryWrapper"
import MainNav from "../../components/MainNav"
import "../globals.css"
import { Exo_2 } from "next/font/google"

const exo = Exo_2({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`bg-[#F5F7FA] ${exo.className}`}>
        <QueryWrapper>
          <AuthWrapper>
            <div className="absolute top-0">
              <MainNav />
            </div>
            {children}
          </AuthWrapper>
        </QueryWrapper>
      </body>
    </html>
  )
}
