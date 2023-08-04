import MainNav from "../../components/MainNav"
import "../globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="absolute top-0">
          <MainNav />
        </div>

        {children}
      </body>
    </html>
  )
}
