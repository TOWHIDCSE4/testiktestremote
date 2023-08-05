import QueryWrapper from "../../components/QueryWrapper"
import "../globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryWrapper>{children}</QueryWrapper>
      </body>
    </html>
  )
}
