"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());

	// Ambil Client ID dari environment variable
	const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

	return (
		<GoogleOAuthProvider clientId={googleClientId}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</GoogleOAuthProvider>
	);
}
