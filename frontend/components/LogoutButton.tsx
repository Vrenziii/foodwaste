"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
	const router = useRouter();

	const handleLogout = () => {
		// Hapus token & data user dari browser
		localStorage.removeItem("token");
		localStorage.removeItem("user");

		// Redirect kembali ke halaman login
		router.push("/login");
	};

	return (
		<button
			onClick={handleLogout}
			className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
		>
			Logout
		</button>
	);
}
