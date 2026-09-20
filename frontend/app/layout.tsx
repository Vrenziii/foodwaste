import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers"; // Import Providers

export const metadata: Metadata = {
	title: "FoodWaste App",
	description: "Aplikasi Penyelamat Makanan Surplus",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="id">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
