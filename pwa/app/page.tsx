'use client';
import React, { useEffect, useRef } from "react";
import { useSession, signIn } from "next-auth/react"; // import client side tools
import { useContent } from "Utils/ContentProvider";
import Container from "Components/common/Container";
import Nav from "Components/nav/Nav";
import { Toaster } from "Components/ui/toaster";
import axios from 'axios';

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
			signIn();
		},
	});
	
	if (status === 'loading') {
        return <h2 className='loading'>Loading...</h2>;
    }

	return (
		<div className="app-container">
			<Toaster />
			<Nav />
			<Container>
				{state.content}
			</Container>
		</div>
	);
};

export default App;