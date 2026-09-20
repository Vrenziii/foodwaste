"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";

export default function RegisterPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		nama: "",
		email: "",
		password: "",
		role: "pembeli",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			await api.post("/auth/register", formData);
			router.push("/login");
		} catch (err: any) {
			setError(err.response?.data?.message || "Registrasi gagal");
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-md p-6 rounded-xl border border-border bg-card space-y-4">
				<h1 className="text-2xl font-bold text-center text-green-600">
					Daftar Akun Baru
				</h1>

				{error && <p className="text-xs text-red-500 text-center">{error}</p>}

				<form onSubmit={handleRegister} className="space-y-3">
					<div>
						<label className="text-xs font-medium">Nama Lengkap</label>
						<input
							type="text"
							value={formData.nama}
							onChange={(e) =>
								setFormData({ ...formData, nama: e.target.value })
							}
							className="w-full p-2 mt-1 rounded-lg border border-border bg-background"
							required
						/>
					</div>

					<div>
						<label className="text-xs font-medium">Email</label>
						<input
							type="email"
							value={formData.email}
							onChange={(e) =>
								setFormData({ ...formData, email: e.target.value })
							}
							className="w-full p-2 mt-1 rounded-lg border border-border bg-background"
							required
						/>
					</div>

					<div>
						<label className="text-xs font-medium">Password</label>
						<input
							type="password"
							value={formData.password}
							onChange={(e) =>
								setFormData({ ...formData, password: e.target.value })
							}
							className="w-full p-2 mt-1 rounded-lg border border-border bg-background"
							required
						/>
					</div>

					<div>
						<label className="text-xs font-medium">Daftar Sebagai</label>
						<select
							value={formData.role}
							onChange={(e) =>
								setFormData({ ...formData, role: e.target.value })
							}
							className="w-full p-2 mt-1 rounded-lg border border-border bg-background"
						>
							<option value="pembeli">Pembeli</option>
							<option value="penjual">Penjual</option>
						</select>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
					>
						{loading ? "Mendaftarkan..." : "Register"}
					</button>
				</form>

				<p className="text-xs text-center text-gray-400">
					Sudah punya akun?{" "}
					<Link
						href="/login"
						className="text-green-500 font-semibold underline"
					>
						Login di sini
					</Link>
				</p>
			</div>
		</main>
	);
}
