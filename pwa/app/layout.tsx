import "../styles/globals.css"
import { SessionProvider } from "next-auth/react"
import { auth } from "../utils/auth"
import { ContentProvider } from "Utils/ContentProvider";
export const metadata = {
	title: 'Travel Event Planner',
	description: 'Developed by Team Spelunkers',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const session = await auth();
	return (
		<html lang="en">
			<body>
				<SessionProvider session={session}>
					<ContentProvider>
						{children}
					</ContentProvider>
				</SessionProvider>
			</body>
		</html>
	)
}
