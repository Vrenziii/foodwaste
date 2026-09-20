const { Product } = require("../models");

// Get All Products (Untuk Katalog Utama)
// Get All Products (Untuk Katalog Utama - Hanya yang APPROVED)
exports.getAllProducts = async (req, res) => {
	try {
		const products = await Product.findAll({
			where: {
				status: "approved", // Filter hanya produk yang sudah disetujui Validator/Admin
			},
			order: [["createdAt", "DESC"]],
		});
		return res.status(200).json({ success: true, data: products });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

// Get Products by Penjual (Untuk Dashboard Penjual)
exports.getProductsByPenjual = async (req, res) => {
	try {
		const { penjualId } = req.params;
		const products = await Product.findAll({
			where: { penjualId },
			order: [["createdAt", "DESC"]],
		});
		return res.status(200).json({ success: true, data: products });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

// Create Product (Dengan Upload Foto Multer)
exports.createProduct = async (req, res) => {
	try {
		const {
			penjualId,
			nama_produk,
			kategori,
			harga,
			harga_asli,
			stok,
			expired_at,
			deskripsi,
		} = req.body;
		const foto = req.file ? `/uploads/${req.file.filename}` : null;

		const product = await Product.create({
			penjualId,
			nama_produk,
			kategori,
			harga,
			harga_asli,
			stok,
			expired_at,
			foto,
			deskripsi,
			status: "pending", // Default status menunggu validasi
		});

		return res.status(201).json({ success: true, data: product });
	} catch (error) {
		return res.status(400).json({ success: false, message: error.message });
	}
};

// Update Product
exports.updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			nama_produk,
			kategori,
			harga,
			harga_asli,
			stok,
			expired_at,
			status,
			deskripsi,
		} = req.body;

		const product = await Product.findByPk(id);
		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Produk tidak ditemukan" });
		}

		let foto = product.foto;
		if (req.file) {
			foto = `/uploads/${req.file.filename}`;
		}

		await product.update({
			nama_produk,
			kategori,
			harga,
			harga_asli,
			stok,
			expired_at,
			status,
			foto,
			deskripsi,
		});

		return res.status(200).json({ success: true, data: product });
	} catch (error) {
		return res.status(400).json({ success: false, message: error.message });
	}
};

// Delete Product
exports.deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await Product.findByPk(id);
		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Produk tidak ditemukan" });
		}

		await product.destroy();
		return res
			.status(200)
			.json({ success: true, message: "Produk berhasil dihapus" });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

// Update Status Produk (Khusus Validator / Admin)
// Update Status Produk, Validator ID, dan Validated At
exports.updateProductStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status, validatorId } = req.body;

		console.log("--- DEBUG VALIDATOR ---");
		console.log("ID Produk:", id);
		console.log("Status:", status);
		console.log("Validator ID dari Request:", validatorId);

		const product = await Product.findByPk(id);
		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Produk tidak ditemukan" });
		}

		const validatedAt = status === "pending" ? null : new Date();

		// Update produk di database
		await product.update({
			status: status,
			validatorId: validatorId || null,
			validatedAt: validatedAt,
		});

		console.log("Hasil Update Data:", product.toJSON());

		return res.status(200).json({
			success: true,
			message: `Status produk berhasil diubah menjadi ${status}`,
			data: product,
		});
	} catch (error) {
		console.error("Error Update Status:", error);
		return res.status(500).json({ success: false, message: error.message });
	}
};

// Mengambil produk khusus status PENDING untuk Validator
exports.getPendingProducts = async (req, res) => {
	try {
		const products = await Product.findAll({
			where: {
				status: "pending", // Hanya ambil yang pending
			},
			order: [["createdAt", "DESC"]],
		});

		return res.status(200).json({
			success: true,
			data: products,
		});
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};
