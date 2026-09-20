"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
	const router = useRouter();
	const [user, setUser] = useState<{ nama: string; role: string } | null>(null);

	// Cek status login saat komponen dimuat
	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			try {
				setUser(JSON.parse(storedUser));
			} catch (e) {
				setUser(null);
			}
		}
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setUser(null);
		router.push("/login");
	};

	return (
		<header className="flex justify-between items-center border-b pb-4">
			<Link href="/" className="text-3xl font-bold text-green-600">
				FoodWaste Market
			</Link>

			<div className="flex items-center gap-4">
				{user ? (
					// DITAMPILKAN JIKA USER SUDAH LOGIN
					<>
						<span className="text-sm text-gray-600 font-medium">
							Halo, <strong className="text-foreground">{user.nama}</strong> (
							{user.role})
						</span>

						{(user.role === "penjual" || user.role === "admin") && (
							<Link
								href="/dashboard/products"
								className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
							>
								Dashboard
							</Link>
						)}

						<button
							onClick={handleLogout}
							className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
						>
							Logout
						</button>
					</>
				) : (
					// DITAMPILKAN JIKA USER BELUM LOGIN
					<>
						<Link
							href="/login"
							className="px-4 py-2 border border-border text-sm font-medium rounded-lg hover:bg-muted transition"
						>
							Login
						</Link>
						<Link
							href="/register"
							className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
						>
							Register
						</Link>
					</>
				)}
			</div>
		</header>
	);
}
