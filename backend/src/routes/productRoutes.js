const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middleware/upload");
const { protect, restrictTo } = require("../middleware/auth");

// Akses Publik
router.get("/", productController.getAllProducts);

// Akses Terproteksi (Penjual & Admin)
router.get(
	"/my-products",
	protect,
	restrictTo("penjual", "admin"),
	productController.getMyProducts,
);
router.post(
	"/",
	protect,
	restrictTo("penjual", "admin"),
	upload.single("foto"),
	productController.createProduct,
);

module.exports = router;
