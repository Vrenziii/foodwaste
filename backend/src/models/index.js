const User = require("./User");
const Product = require("./Product");

// Relasi Penjual ke Product
User.hasMany(Product, { foreignKey: "penjualId", as: "produkPenjual" });
Product.belongsTo(User, { foreignKey: "penjualId", as: "penjual" });

// Relasi Validator ke Product
User.hasMany(Product, { foreignKey: "validatorId", as: "produkValidated" });
Product.belongsTo(User, { foreignKey: "validatorId", as: "validator" });

module.exports = {
	User,
	Product,
};
