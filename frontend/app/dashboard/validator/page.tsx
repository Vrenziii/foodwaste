"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";

export default function ValidatorDashboard() {
	const queryClient = useQueryClient();
	const [user, setUser] = useState<any>(null);

	// Ambil data user validator dari localStorage
	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			try {
				setUser(JSON.parse(storedUser));
			} catch (err) {
				console.error("Error parsing user data:", err);
			}
		}
	}, []);

	// Fetch produk yang statusnya PENDING
	const {
		data: products,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["pending-products"],
		queryFn: async () => {
			const res = await api.get("/products/pending");
			return res.data.data;
		},
	});

	// Mutation Update Status + validator_id
	const updateStatusMutation = useMutation({
		mutationFn: async ({ id, status }: { id: number; status: string }) => {
			// 1. Ambil data user dari localStorage
			const storedUser = localStorage.getItem("user");
			const parsedUser = storedUser ? JSON.parse(storedUser) : null;

			// Log isi localStorage di Console Browser (F12) untuk melihat struktur aslinya
			console.log("Data User dari localStorage:", parsedUser);

			// 2. Cari ID dari berbagai kemungkinan nama properti
			const currentValidatorId =
				parsedUser?.id ||
				parsedUser?.userId ||
				parsedUser?.user_id ||
				parsedUser?.validatorId;

			if (!currentValidatorId) {
				alert("ID Validator tidak ditemukan! Coba logout lalu login kembali.");
				return;
			}

			console.log("Validator ID yang dikirim ke backend:", currentValidatorId);

			// 3. Kirim ke backend
			return await api.patch(`/products/${id}/status`, {
				status,
				validatorId: currentValidatorId,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["pending-products"] });
			alert("Status produk berhasil diperbarui!");
		},
		onError: (err: any) => {
			alert(
				"Gagal mengubah status: " +
					(err.response?.data?.message || err.message),
			);
		},
	});
	return (
		<main className="min-h-screen p-8 max-w-6xl mx-auto space-y-8">
			<Navbar />

			<div className="border-b pb-4">
				<h1 className="text-2xl font-bold text-green-600">
					Dashboard Validator — Persetujuan Produk
				</h1>
				<p className="text-sm text-gray-500">
					Tinjau dan setujui produk surplus yang diajukan oleh Penjual.
				</p>
			</div>

			<section className="space-y-4">
				{isLoading && (
					<p className="text-sm text-gray-500">Memuat pengajuan produk...</p>
				)}
				{isError && (
					<p className="text-sm text-red-500">Gagal memuat data produk.</p>
				)}

				{!isLoading && products?.length === 0 && (
					<p className="text-sm text-gray-500">
						Tidak ada produk yang menunggu persetujuan.
					</p>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{products?.map((item: any) => (
						<div
							key={item.id}
							className="border p-5 rounded-xl space-y-4 bg-card shadow-sm flex flex-col justify-between"
						>
							<div className="space-y-3">
								<div className="flex justify-between items-start">
									<h3 className="font-bold text-lg">{item.nama_produk}</h3>
									<span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-yellow-100 text-yellow-800">
										{item.status || "PENDING"}
									</span>
								</div>

								{item.foto && (
									<img
										src={`http://localhost:5000${item.foto}`}
										alt={item.nama_produk}
										className="w-full h-40 object-cover rounded-lg"
									/>
								)}

								<p className="text-xs text-gray-500">
									Kategori: {item.kategori}
								</p>
								<p className="text-xs text-gray-600">
									{item.deskripsi || "Tidak ada deskripsi."}
								</p>
								<p className="text-sm font-bold text-green-600">
									Rp {Number(item.harga).toLocaleString("id-ID")}{" "}
									{item.harga_asli && (
										<span className="text-xs text-gray-400 line-through">
											Rp {Number(item.harga_asli).toLocaleString("id-ID")}
										</span>
									)}
								</p>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-3 pt-3 border-t">
								<button
									onClick={() =>
										updateStatusMutation.mutate({
											id: item.id,
											status: "approved",
										})
									}
									disabled={updateStatusMutation.isPending}
									className="flex-1 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
								>
									Approve (Setujui)
								</button>
								<button
									onClick={() =>
										updateStatusMutation.mutate({
											id: item.id,
											status: "rejected",
										})
									}
									disabled={updateStatusMutation.isPending}
									className="flex-1 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
								>
									Reject (Tolak)
								</button>
							</div>
						</div>
					))}
				</div>
			</section>
		</main>
	);
}
