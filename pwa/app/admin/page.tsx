'use client';
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

// load the admin client-side
const App = dynamic(() => import("../../components/admin/App"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const Admin: NextPage = () => {
  const router = useRouter();

  // Redirect to login page if not authenticated
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    }
  });
  return <App /> 
};

export default Admin;
