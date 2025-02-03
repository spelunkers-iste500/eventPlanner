import "../styles/globals.css"
import Layout from "../components/common/Layout"
// import type { DehydratedState } from "react-query"
import { SessionProvider } from "next-auth/react"
import { auth } from "@utils/auth"
export const metadata = {
  title: 'Travel Event Planner',
  description: 'Developed by Team Spelunkers',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
  }) {
  const session = await auth();
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {children}
          </SessionProvider>
      </body>
    </html>
  )
}
