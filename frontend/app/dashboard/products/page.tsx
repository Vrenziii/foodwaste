"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";

export default function SellerDashboard() {
	const queryClient = useQueryClient();
	const [user, setUser] = useState<any>(null);

	// State Form Tambah Produk
	const [namaProduk, setNamaProduk] = useState("");
	const [deskripsi, setDeskripsi] = useState("");
	const [kategori, setKategori] = useState("Makanan Berat");
	const [harga, setHarga] = useState("");
	const [hargaAsli, setHargaAsli] = useState("");
	const [stok, setStok] = useState("");
	const [expiredAt, setExpiredAt] = useState("");
	const [foto, setFoto] = useState<File | null>(null);

	// Ambil data user dari localStorage
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

	// Fetch Produk khusus milik Penjual
	const {
		data: products,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["seller-products", user?.id],
		queryFn: async () => {
			if (!user?.id) return [];
			const res = await api.get(`/products/penjual/${user.id}`);
			return res.data.data;
		},
		enabled: !!user?.id,
	});

	// Mutation Tambah Produk
	const addProductMutation = useMutation({
		mutationFn: async (formData: FormData) => {
			return await api.post("/products", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["seller-products"] });
			// Reset Form Input
			setNamaProduk("");
			setDeskripsi("");
			setHarga("");
			setHargaAsli("");
			setStok("");
			setExpiredAt("");
			setFoto(null);
			alert("Produk berhasil ditambahkan dan menunggu persetujuan Validator!");
		},
		onError: (err: any) => {
			alert(
				"Gagal menambah produk: " +
					(err.response?.data?.message || err.message),
			);
		},
	});

	// Mutation Hapus Produk
	const deleteProductMutation = useMutation({
		mutationFn: async (id: number) => {
			return await api.delete(`/products/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["seller-products"] });
		},
		onError: (err: any) => {
			alert(
				"Gagal menghapus produk: " +
					(err.response?.data?.message || err.message),
			);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) {
			alert("Anda harus login terlebih dahulu!");
			return;
		}

		const formData = new FormData();
		formData.append("penjualId", user.id);
		formData.append("nama_produk", namaProduk);
		formData.append("deskripsi", deskripsi);
		formData.append("kategori", kategori);
		formData.append("harga", harga);
		formData.append("harga_asli", hargaAsli);
		formData.append("stok", stok);
		formData.append("expired_at", expiredAt);
		if (foto) formData.append("foto", foto);

		addProductMutation.mutate(formData);
	};

	return (
		<main className="min-h-screen p-8 max-w-6xl mx-auto space-y-8">
			{/* Navbar Reaktif */}
			<Navbar />

			<div className="flex justify-between items-center border-b pb-4">
				<h1 className="text-2xl font-bold text-green-600">
					Dashboard Penjual — Kelola Produk
				</h1>
			</div>

			{/* Form Tambah Produk */}
			<form
				onSubmit={handleSubmit}
				className="border p-6 rounded-xl space-y-4 bg-card shadow-sm"
			>
				<h2 className="text-lg font-semibold">Tambah Produk Surplus Baru</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="text-xs font-medium">Nama Produk</label>
						<input
							type="text"
							required
							value={namaProduk}
							onChange={(e) => setNamaProduk(e.target.value)}
							className="w-full p-2 border rounded-lg text-sm mt-1"
							placeholder="Contoh: Roti Manis Cokelat"
						/>
					</div>

					<div>
						<label className="text-xs font-medium">Kategori</label>
						<select
							value={kategori}
							onChange={(e) => setKategori(e.target.value)}
							className="w-full p-2 border rounded-lg text-sm mt-1"
						>
							<option value="Makanan Berat">Makanan Berat</option>
							<option value="Roti & Kue">Roti & Kue</option>
							<option value="Minuman">Minuman</option>
							<option value="Bahan Mentah">Bahan Mentah</option>
						</select>
					</div>

					<div>
						<label className="text-xs font-medium">Harga Diskon (Rp)</label>
						<input
							type="number"
							required
							value={harga}
							onChange={(e) => setHarga(e.target.value)}
							className="w-full p-2 border rounded-lg text-sm mt-1"
							placeholder="15000"
						/>
					</div>

					<div>
						<label className="text-xs font-medium">Harga Asli (Rp)</label>
						<input
							type="number"
							value={hargaAsli}
							onChange={(e) => setHargaAsli(e.target.value)}
							className="w-full p-2 border rounded-lg text-sm mt-1"
							placeholder="30000"
						/>
					</div>

					<div>
						<label className="text-xs font-medium">Stok</label>
						<input
							type="number"
							required
							value={stok}
							onChange={(e) => setStok(e.target.value)}
							className="w-full p-2 border rounded-lg text-sm mt-1"
							placeholder="5"
						/>
					</div>

					<div>
						<label className="text-xs font-medium">Tanggal Kadaluwarsa</label>
						<input
							type="datetime-local"
							required
							value={expiredAt}
							onChange={(e) => setExpiredAt(e.target.value)}
							className="w-full p-2 border rounded-lg text-sm mt-1"
						/>
					</div>
				</div>

				{/* Input Deskripsi Produk */}
				<div>
					<label className="text-xs font-medium">Deskripsi Produk</label>
					<textarea
						rows={3}
						value={deskripsi}
						onChange={(e) => setDeskripsi(e.target.value)}
						className="w-full p-2 border rounded-lg text-sm mt-1"
						placeholder="Jelaskan porsi, kondisi kemasan, atau detail makanan..."
					/>
				</div>

				<div>
					<label className="text-xs font-medium">Foto Produk</label>
					<input
						type="file"
						accept="image/*"
						onChange={(e) => setFoto(e.target.files?.[0] || null)}
						className="w-full p-2 border rounded-lg text-sm mt-1"
					/>
				</div>

				<button
					type="submit"
					disabled={addProductMutation.isPending}
					className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
				>
					{addProductMutation.isPending ? "Menyimpan..." : "Tambah Produk"}
				</button>
			</form>

			{/* Daftar Produk Milik Penjual */}
			<section className="space-y-4">
				<h2 className="text-lg font-semibold">Daftar Produk Anda</h2>

				{isLoading && <p className="text-sm text-gray-500">Memuat produk...</p>}
				{isError && (
					<p className="text-sm text-red-500">Gagal memuat produk.</p>
				)}

				{!isLoading && products?.length === 0 && (
					<p className="text-sm text-gray-500">
						Belum ada produk yang ditambahkan.
					</p>
				)}

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{products?.map((item: any) => (
						<div
							key={item.id}
							className="border p-4 rounded-xl space-y-3 bg-card shadow-sm"
						>
							{/* Gambar Produk */}
							{item.foto ? (
								<img
									src={`http://localhost:5000${item.foto}`}
									alt={item.nama_produk}
									className="w-full h-36 object-cover rounded-lg"
								/>
							) : (
								<div className="w-full h-36 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground">
									Tanpa Gambar
								</div>
							)}

							{/* Header Kartu: Nama & Status Badge */}
							<div className="flex justify-between items-start gap-2">
								<h3 className="font-bold text-base leading-tight">
									{item.nama_produk}
								</h3>

								{/* Status Approval Badge */}
								<span
									className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
										item.status === "approved"
											? "bg-green-100 text-green-700 border border-green-300"
											: item.status === "rejected"
												? "bg-red-100 text-red-700 border border-red-300"
												: "bg-yellow-100 text-yellow-800 border border-yellow-300"
									}`}
								>
									{item.status || "PENDING"}
								</span>
							</div>

							<p className="text-xs text-gray-500">Kategori: {item.kategori}</p>

							{/* Deskripsi Produk */}
							{item.deskripsi && (
								<p className="text-xs text-gray-600 line-clamp-2">
									{item.deskripsi}
								</p>
							)}

							<div className="flex justify-between items-center text-sm">
								<p className="font-bold text-green-600">
									Rp {Number(item.harga).toLocaleString("id-ID")}
								</p>
								<p className="text-xs text-gray-500">Stok: {item.stok}</p>
							</div>

							{/* Tombol Hapus */}
							<button
								onClick={() => {
									if (confirm("Yakin ingin menghapus produk ini?")) {
										deleteProductMutation.mutate(item.id);
									}
								}}
								className="w-full py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition mt-2"
							>
								Hapus Produk
							</button>
						</div>
					))}
				</div>
			</section>
		</main>
	);
}
