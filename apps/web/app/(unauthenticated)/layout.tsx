import QueryWrapper from "../../components/QueryWrapper"
import { Toaster } from "react-hot-toast"
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
      {/* <link rel="icon" type="image/x-icon" href={`/saleskits_logo.png`} /> */}
      <body className={exo.className}>
        <Toaster position="top-left" />
        <QueryWrapper>{children}</QueryWrapper>
      </body>
    </html>
  )
}
