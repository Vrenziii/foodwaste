const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const productController = require("../controllers/productController");

// Konfigurasi Multer untuk Upload Gambar
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});
const upload = multer({ storage });

// Endpoints
router.get("/", productController.getAllProducts);
router.get("/penjual/:penjualId", productController.getProductsByPenjual);
router.post("/", upload.single("foto"), productController.createProduct);
router.put("/:id", upload.single("foto"), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
// Endpoint khusus ubah status produk oleh Admin/Validator
router.patch('/:id/status', productController.updateProductStatus);
router.get("/pending", productController.getPendingProducts);

module.exports = router;
