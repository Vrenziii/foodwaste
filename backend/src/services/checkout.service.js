const {
	sequelize,
	Product,
	Wallet,
	WalletTransaction,
	Transaction,
	TransactionItem,
} = require("../models");

async function processCheckout(userId, alamat, items) {
	const t = await sequelize.transaction();

	try {
		let totalHarga = 0;
		const productUpdates = [];

		for (const item of items) {
			const product = await Product.findByPk(item.productId, {
				transaction: t,
			});
			if (
				!product ||
				product.status !== "approved" ||
				product.stok < item.qty
			) {
				throw new Error(
					`Stok produk ${product ? product.nama_produk : ""} tidak memadai/tidak valid`,
				);
			}
			const subtotal = Number(product.harga) * item.qty;
			totalHarga += subtotal;

			productUpdates.push({ product, qty: item.qty, subtotal });
		}

		// Customer Wallet Verification
		const customerWallet = await Wallet.findOne({
			where: { userId },
			transaction: t,
		});
		if (!customerWallet || Number(customerWallet.saldo) < totalHarga) {
			throw new Error("Saldo wallet tidak cukup");
		}

		// 1. Deduct Customer Balance
		const newCustSaldo = Number(customerWallet.saldo) - totalHarga;
		await customerWallet.update({ saldo: newCustSaldo }, { transaction: t });

		// Transaction ID Generation
		const trxId = `TRX-${Date.now()}`;
		await Transaction.create(
			{
				id: trxId,
				customerId: userId,
				total_harga: totalHarga,
				status: "paid",
				alamat_pengiriman: alamat,
			},
			{ transaction: t },
		);

		await WalletTransaction.create(
			{
				walletId: customerWallet.id,
				tipe: "payment",
				jumlah: -totalHarga,
				saldo_after: newCustSaldo,
				referenceId: trxId,
				status: "success",
			},
			{ transaction: t },
		);

		// 2. Transfer Per Item to Sellers & Update Stock
		for (const itemData of productUpdates) {
			const { product, qty, subtotal } = itemData;

			// Update Stock
			await product.update({ stok: product.stok - qty }, { transaction: t });

			// Record Transaction Item
			await TransactionItem.create(
				{
					transactionId: trxId,
					productId: product.id,
					qty,
					harga_satuan: product.harga,
					subtotal,
					isDonasi:
						items.find((i) => i.productId === product.id).isDonasi || false,
					alamat_panti:
						items.find((i) => i.productId === product.id).alamat_panti || null,
				},
				{ transaction: t },
			);

			// Seller Wallet Deposit
			const sellerWallet = await Wallet.findOne({
				where: { userId: product.penjualId },
				transaction: t,
			});
			if (sellerWallet) {
				const newSellerSaldo = Number(sellerWallet.saldo) + subtotal;
				await sellerWallet.update(
					{ saldo: newSellerSaldo },
					{ transaction: t },
				);

				await WalletTransaction.create(
					{
						walletId: sellerWallet.id,
						tipe: "transfer_in",
						jumlah: subtotal,
						saldo_after: newSellerSaldo,
						referenceId: trxId,
						status: "success",
					},
					{ transaction: t },
				);
			}
		}

		await t.commit();
		return { success: true, transactionId: trxId };
	} catch (error) {
		await t.rollback();
		throw error;
	}
}

module.exports = { processCheckout };
