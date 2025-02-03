'use client';
import React, { useState } from "react";
import Nav from "../components/nav/Nav";
import Dashboard from "../components/dashboard/Dashboard";
// import { auth } from "@/auth";
import { useSession, SessionProvider, signIn } from "next-auth/react";

export interface ContentState {
	name: string;
	content: React.JSX.Element;
}

const App: React.FC = () => {

	// Redirect to login page if not authenticated
	const { data: session } = useSession({
		required: true,
		onUnauthenticated() {
			signIn();
		},
	});

	// if (session === null || session === undefined) {  }

	// Set the initial content state
	// This will be updated by the Nav component and resembles how nav items are stored in the Nav component
	const [state, setState] = useState<ContentState>({
        name: 'Dashboard',
        content: <Dashboard />,
    });

	// Function to update the content state from the Nav component
	const setContent = (newName: string, newContent: React.JSX.Element) => {
		setState(() => ({
			name: newName,
			content: newContent,
		}));
	};

	// // If the session is loading, display a loading message
	// if (status === 'loading') {
	// 	return <h2 className='loading'>Loading...</h2>;
	// }

	return (
		<div className="app-container">
			<Nav session={session} state={state} setContent={setContent} />
			{state.content}
		</div>
	);
};

export default App;