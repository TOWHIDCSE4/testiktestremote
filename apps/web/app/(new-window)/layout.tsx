import AuthGuard from "../../components/AuthGuard"
import QueryWrapper from "../../components/QueryWrapper"
import { Toaster } from "react-hot-toast"
import "../globals.css"
import { Exo_2 } from "next/font/google"
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
      {/* <link rel="icon" type="image/x-icon" href={`/saleskits_logo.png`} /> */}
      <body className={exo.className}>
        <Toaster position="top-left" />
        <QueryWrapper>
          <AuthGuard>{children}</AuthGuard>
        </QueryWrapper>
      </body>
    </html>
  )
}
