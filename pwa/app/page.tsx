'use client';
import React, { useRef, useState } from "react";
import Nav from "../components/nav/Nav";
import Dashboard from "../components/dashboard/Dashboard";
import { useSession, SessionProvider, signIn } from "next-auth/react"; // import client side tools
import { useRouter } from "next/navigation";

export interface ContentState {
	name: string;
	content: React.JSX.Element;
}

const App: React.FC = () => {
	const signingIn = useRef(false); // Prevents race condition in FF of two signIn() calls

	// Redirect to login page if not authenticated
	const { status, data: session } = useSession({
		required: true,
		onUnauthenticated() {
			if (signingIn.current) return; // stop executing for second flow
			signingIn.current = true; // set flag to true for first
			signIn();
		},
	});
	if (status === 'loading') {
        return <h2 className='loading'>Loading...</h2>;
    }

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
			<Nav state={state} setContent={setContent} />
			{state.content}
		</div>
	);
};

export default App;