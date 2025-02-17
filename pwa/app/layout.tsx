import "../styles/globals.css"
import { auth } from "../utils/auth"
import AppProvider from "Utils/AppProvider";
export const metadata = {
	title: 'Travel Event Planner',
	description: 'Developed by Team Spelunkers',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const session = await auth();
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<AppProvider session={session}>
					{children}
				</AppProvider>
			</body>
		</html>
	)
}
