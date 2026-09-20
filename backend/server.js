const express = require("express");
const cors = require("cors");
const app = express();

// Pasang CORS fleksibel untuk localhost
app.use(
	cors({
		origin: "*", // Izinkan semua origin saat development
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

// Body Parser - Wajib berada sebelum route!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Static Folder
app.use("/uploads", express.static("uploads"));

// Routes
const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
