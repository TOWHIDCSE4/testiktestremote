import QueryWrapper from "../../components/QueryWrapper"
import { Toaster } from "react-hot-toast"
import "../globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* <link rel="icon" type="image/x-icon" href={`/saleskits_logo.png`} /> */}
      <body>
        <Toaster position="top-left" />
        <QueryWrapper>{children}</QueryWrapper>
      </body>
    </html>
  )
}
