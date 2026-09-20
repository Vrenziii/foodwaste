const jwt = require("jsonwebtoken");

// Middleware Verifikasi Token JWT
exports.protect = (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}

	if (!token) {
		return res
			.status(401)
			.json({
				success: false,
				message: "Akses ditolak, token tidak ditemukan",
			});
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
		req.user = decoded; // Berisi { id, role, ... }
		next();
	} catch (err) {
		return res
			.status(401)
			.json({ success: false, message: "Token tidak valid" });
	}
};

// Middleware Pembatasan Role
exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: `Role (${req.user.role}) tidak memiliki izin untuk mengakses fitur ini`,
			});
		}
		next();
	};
};
