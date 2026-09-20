"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import Navbar from '@/components/Navbar'; // Import Navbar baru
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const res = await api.post("/auth/login", { email, password });

			// Simpan Token & Data User
			localStorage.setItem("token", res.data.token);
			localStorage.setItem("user", JSON.stringify(res.data.user));

			// Redirect Berdasarkan Role
			const role = res.data.user.role;
			// Redirect berdasarkan role
			if (role === "validator" || role === "admin") {
				router.push("/dashboard/validator");
			} else if (role === "penjual") {
				router.push("/dashboard/products");
			} else {
				router.push("/");
			}
		} catch (err: any) {
			setError(err.response?.data?.message || "Login gagal");
		} finally {
			setLoading(false);
		}
	};

    const handleGoogleSuccess = async (credentialResponse: any) => {
			try {
				// Kirim ID Token dari Google ke Backend
				const res = await api.post("/auth/google", {
					token: credentialResponse.credential,
				});

				// Simpan Token & User dari Backend kita
				localStorage.setItem("token", res.data.token);
				localStorage.setItem("user", JSON.stringify(res.data.user));

				// Redirect sesuai role
				if (
					res.data.user.role === "penjual" ||
					res.data.user.role === "admin"
				) {
					router.push("/dashboard/products");
				} else {
					router.push("/");
				}
			} catch (err: any) {
				setError("Google Login Gagal");
			}
		};

	return (
		<main className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-md p-6 rounded-xl border border-border bg-card space-y-4">
				<h1 className="text-2xl font-bold text-center text-green-600">
					Login FoodWaste App
				</h1>

				{error && <p className="text-xs text-red-500 text-center">{error}</p>}

				<form onSubmit={handleLogin} className="space-y-3">
					<div>
						<label className="text-xs font-medium">Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full p-2 mt-1 rounded-lg border border-border bg-background"
							required
						/>
					</div>

					<div>
						<label className="text-xs font-medium">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full p-2 mt-1 rounded-lg border border-border bg-background"
							required
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
					>
						{loading ? "Masuk..." : "Login"}
					</button>
				</form>

				{/* <div className="mt-4 flex flex-col items-center gap-2">
					<div className="text-xs text-gray-400 mb-1">atau masuk dengan</div>
					<GoogleLogin
						onSuccess={handleGoogleSuccess}
						onError={() => setError("Google Login Gagal")}
					/>
				</div> */}

				<p className="text-xs text-center text-gray-400">
					Belum punya akun?{" "}
					<Link
						href="/register"
						className="text-green-500 font-semibold underline"
					>
						Daftar di sini
					</Link>
				</p>
			</div>
		</main>
	);
}
