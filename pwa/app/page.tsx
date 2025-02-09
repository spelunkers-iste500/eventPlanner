'use client';
import React, { useRef, useState } from "react";
import Nav from "../components/nav/Nav";
import Dashboard from "../components/dashboard/Dashboard";
import Container from "../components/common/Container";
import { useSession, signIn } from "next-auth/react"; // import client side tools
import { useRouter } from "next/navigation";
import { useContent } from "@utils/ContentProvider";

export interface ContentState {
	name: string;
	content: React.JSX.Element;
}

const App: React.FC = () => {
	const { state } = useContent();

	// https://github.com/nextauthjs/next-auth/issues/9177#issuecomment-1919066154
	const signingIn = useRef(false); // Prevents race condition in FF of two signIn() calls 
	// Redirect to login page if not authenticated
	const { status, data: session } = useSession({
		required: true,
		onUnauthenticated() {
			if (signingIn.current) return; // stop executing for second flow
			signingIn.current = true; // set flag to true for first
			// router.push('/login');
			signIn();
		},
	});

	if (status === 'loading') {
        return <h2 className='loading'>Loading...</h2>;
    }

	return (
		<div className="app-container">
			<Nav />
			<Container>
				{state.content}
			</Container>
		</div>
	);
};

export default App;