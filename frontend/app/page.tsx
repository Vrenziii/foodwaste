"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton"; // Import komponen LogoutButton
import Navbar from '@/components/Navbar'; // Import Navbar baru

export default function Home() {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["products"],
		queryFn: async () => {
			const res = await api.get("/products");
			return res.data;
		},
	});

	return (
		<main className="min-h-screen p-8 max-w-6xl mx-auto space-y-6">
			<Navbar />

			<section>
				<h2 className="text-xl font-semibold mb-4">Katalog Makanan Surplus</h2>
				{isLoading && <p>Memuat katalog...</p>}
				{isError && (
					<p className="text-red-500">Gagal memuat katalog makanan.</p>
				)}

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{data?.data?.map((product: any) => (
						<div
							key={product.id}
							className="border rounded-xl p-4 space-y-3 bg-card shadow-sm"
						>
							{product.foto ? (
								<img
									src={`http://localhost:5000${product.foto}`}
									alt={product.nama_produk}
									className="w-full h-40 object-cover rounded-lg"
								/>
							) : (
								<div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center text-sm text-muted-foreground">
									Tanpa Gambar
								</div>
							)}
							<h3 className="font-bold text-lg">{product.nama_produk}</h3>
							<p className="text-xs text-gray-500 line-clamp-2">
								{product.deskripsi}
							</p>
							<div className="flex justify-between items-center pt-2 border-t">
								<div>
									<p className="font-bold text-green-600">
										Rp {Number(product.harga).toLocaleString("id-ID")}
									</p>
									{product.harga_asli && (
										<p className="text-xs text-gray-400 line-through">
											Rp {Number(product.harga_asli).toLocaleString("id-ID")}
										</p>
									)}
								</div>
								<button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
									Beli
								</button>
							</div>
						</div>
					))}
				</div>
			</section>
		</main>
	);
}
