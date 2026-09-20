const User = require("../models/User"); // Pastikan model User sudah ada
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/register
exports.register = async (req, res) => {
	try {
		const { nama, email, password, role } = req.body;

		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res
				.status(400)
				.json({ success: false, message: "Email sudah terdaftar" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			nama,
			email,
			password: hashedPassword,
			role: role || "pembeli", // Default: pembeli, penjual, admin, validator
		});

		return res.status(201).json({
			success: true,
			message: "Registrasi berhasil",
			data: {
				id: newUser.id,
				nama: newUser.nama,
				email: newUser.email,
				role: newUser.role,
			},
		});
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

// POST /api/auth/login
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ where: { email } });
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "Email tidak ditemukan" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res
				.status(400)
				.json({ success: false, message: "Password salah" });
		}

		const token = jwt.sign(
			{ id: user.id, role: user.role, nama: user.nama },
			process.env.JWT_SECRET || "secretkey",
			{ expiresIn: "1d" },
		);

		return res.status(200).json({
			success: true,
			token,
			user: {
				id: user.id,
				nama: user.nama,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

// POST /api/auth/google
exports.googleLogin = async (req, res) => {
	try {
		const { token } = req.body;

		// Verifikasi Token Google
		const ticket = await googleClient.verifyIdToken({
			idToken: token,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();
		const { email, name } = payload;

		// Cek apakah user sudah ada di DB
		let user = await User.findOne({ where: { email } });

		// Jika belum ada, buatkan akun baru (default role: pembeli)
		if (!user) {
			user = await User.create({
				nama: name,
				email: email,
				password: "", // Kosongkan karena login via Google OAuth
				role: "pembeli",
			});
		}

		// Buat JWT Token aplikasi kita
		const jwtToken = jwt.sign(
			{ id: user.id, role: user.role, nama: user.nama },
			process.env.JWT_SECRET || "secretkey",
			{ expiresIn: "1d" },
		);

		return res.status(200).json({
			success: true,
			token: jwtToken,
			user: {
				id: user.id,
				nama: user.nama,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: "Google Auth Error: " + error.message });
	}
};
