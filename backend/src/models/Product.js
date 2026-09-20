const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define(
	"Product",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		penjualId: {
			type: DataTypes.INTEGER,
			allowNull: true, // Nanti dihubungkan ke FK User
		},
		nama_produk: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		deskripsi: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		kategori: {
			type: DataTypes.ENUM("makanan", "minuman", "snack", "lainnya"),
			defaultValue: "makanan",
			allowNull: false,
		},
		harga: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
			defaultValue: 0,
		},
		harga_asli: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: true,
		},
		stok: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
		expired_at: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		foto: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		status: {
			type: DataTypes.ENUM("pending", "approved", "rejected"),
			defaultValue: "pending",
			allowNull: false,
		},
		validatorId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		validatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		tableName: "products",
		timestamps: true,
	},
);

module.exports = Product;
