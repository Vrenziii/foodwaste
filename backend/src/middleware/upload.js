const multer = require("multer");
const path = require("path");

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/"); // Folder tujuan simpan gambar
	},
	filename: (req, file, cb) => {
		// Penamaan file unik: timestamp + ekstensi asli
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + path.extname(file.originalname));
	},
});

// Filter jenis file (hanya gambar)
const fileFilter = (req, file, cb) => {
	const allowedTypes = /jpeg|jpg|png|webp/;
	const extname = allowedTypes.test(
		path.extname(file.originalname).toLowerCase(),
	);
	const mimetype = allowedTypes.test(file.mimetype);

	if (extname && mimetype) {
		return cb(null, true);
	} else {
		cb(
			new Error("Hanya file gambar (jpg, jpeg, png, webp) yang diperbolehkan!"),
		);
	}
};

const upload = multer({
	storage: storage,
	limits: { fileSize: 2 * 1024 * 1024 }, // Maksimal 2MB
	fileFilter: fileFilter,
});

module.exports = upload;
