const Product = require("../models/Product");

// GET /api/products (Katalog publik - hanya yang approved)
exports.getAllProducts = async (req, res) => {
	try {
		const products = await Product.findAll({
			where: { status: "approved" }, // Hanya tampilkan yang sudah diapprove validator/admin
			order: [["createdAt", "DESC"]],
		});
		return res.status(200).json({ success: true, data: products });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

// GET /api/products/my-products (Khusus penjual kelola produknya sendiri)
exports.getMyProducts = async (req, res) => {
	try {
		const products = await Product.findAll({
			where: { penjualId: req.user.id },
			order: [["createdAt", "DESC"]],
		});
		return res.status(200).json({ success: true, data: products });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

// POST /api/products (Khusus penjual/admin)
exports.createProduct = async (req, res) => {
	try {
		const {
			nama_produk,
			deskripsi,
			kategori,
			harga,
			harga_asli,
			stok,
			expired_at,
		} = req.body;
		const foto = req.file ? `/uploads/${req.file.filename}` : null;

		const newProduct = await Product.create({
			penjualId: req.user.id, // Diambil langsung dari token JWT
			nama_produk,
			deskripsi: deskripsi || "",
			kategori: kategori || "makanan",
			harga: harga || 0,
			harga_asli: harga_asli || null,
			stok: stok || 1,
			expired_at: expired_at || null,
			foto: foto,
			status: "pending",
		});

		return res.status(201).json({ success: true, data: newProduct });
	} catch (error) {
		return res.status(400).json({ success: false, message: error.message });
	}
};
