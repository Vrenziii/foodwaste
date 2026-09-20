"use client";
import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
	const router = useRouter();
	const [alamat, setAlamat] = useState("");
	const [isDonasi, setIsDonasi] = useState(false);
	const [alamatPanti, setAlamatPanti] = useState("");

	// Example Cart Item
	const items = [
		{
			productId: 1,
			qty: 2,
			isDonasi,
			alamat_panti: isDonasi ? alamatPanti : null,
		},
	];

	const handleCheckout = async () => {
		try {
			await api.post("/orders/checkout", {
				alamat_pengiriman: alamat,
				items,
			});
			alert("Checkout sukses!");
			router.push("/orders");
		} catch (err: any) {
			alert(err.response?.data?.message || "Checkout gagal");
		}
	};

	return (
		<div className="p-6 max-w-lg mx-auto bg-card text-foreground rounded-lg border border-border">
			<h1 className="text-xl font-bold mb-4">Checkout Order</h1>
			<label className="block mb-2 text-sm">Alamat Pengiriman</label>
			<textarea
				className="w-full p-2 border rounded mb-4 text-black"
				value={alamat}
				onChange={(e) => setAlamat(e.target.value)}
			/>

			<div className="flex items-center gap-2 mb-4">
				<input
					type="checkbox"
					id="donasi"
					checked={isDonasi}
					onChange={(e) => setIsDonasi(e.target.checked)}
				/>
				<label htmlFor="donasi">Donasikan Produk ke Panti</label>
			</div>

			{isDonasi && (
				<div className="mb-4">
					<label className="block mb-2 text-sm">Alamat Panti Asuhan</label>
					<textarea
						className="w-full p-2 border rounded text-black"
						value={alamatPanti}
						onChange={(e) => setAlamatPanti(e.target.value)}
					/>
				</div>
			)}

			<button
				onClick={handleCheckout}
				className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
			>
				Bayar dengan Wallet
			</button>
		</div>
	);
}
