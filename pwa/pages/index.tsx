import React, { useState } from "react";
import Nav from "../components/nav/Nav";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Welcome from "./welcome";

export interface ContentState {
    name: string;
    content: JSX.Element;
}

const App: React.FC = () => {
	const router = useRouter();

	// Redirect to login page if not authenticated
	const { status, data: session } = useSession({
		required: true,
		onUnauthenticated() {
			router.push('/login');
		}
	});

	// Set the initial content state
	// This will be updated by the Nav component and resembles how nav items are stored in the Nav component
	const [state, setState] = useState<ContentState>({
        name: 'Dashboard',
        content: <Welcome />,
    });

	// Function to update the content state from the Nav component
	const setContent = (newName: string, newContent: JSX.Element) => {
        setState(() => ({
			name: newName,
            content: newContent,
        }));
    };

	// If the session is loading, display a loading message
	if (status === 'loading') {
		return <h2 className='loading'>Loading...</h2>;
	}

	return (
	<>
		<Nav session={session} state={state} setContent={setContent} />
		{state.content}
  	</>
	);
};

export default App;