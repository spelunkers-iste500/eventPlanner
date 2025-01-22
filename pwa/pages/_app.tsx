import "../styles/globals.css"
import Layout from "../components/common/Layout"
import type { AppProps } from "next/app"
import type { DehydratedState } from "react-query"
import { SessionProvider } from "next-auth/react"

function Root({ Component, pageProps: { session, ...pageProps } }: AppProps<{ session: any; dehydratedState: DehydratedState }>) {
  return <Layout dehydratedState={pageProps.dehydratedState}>
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  </Layout>
}

export default Root
