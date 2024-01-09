import AuthGuard from "../../components/AuthGuard"
import QueryWrapper from "../../components/QueryWrapper"
import MainNav from "../../components/MainNav"
import "../globals.css"
import { Exo_2 } from "next/font/google"
import { Toaster } from "react-hot-toast"
// import {clarity} from 'clarity-js';
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

const exo = Exo_2({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`bg-[#F5F7FA] ${exo.className}`}>
        <Toaster />
        <QueryWrapper>
          <AuthGuard>
            <div className="absolute top-0">
              <MainNav />
            </div>
            <div className="lg:ml-80">{children}</div>
          </AuthGuard>
        </QueryWrapper>
      </body>
    </html>
  )
}
