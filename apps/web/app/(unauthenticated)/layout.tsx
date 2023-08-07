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
      <body>
        <Toaster position="top-left" />
        <QueryWrapper>{children}</QueryWrapper>
      </body>
    </html>
  )
}
