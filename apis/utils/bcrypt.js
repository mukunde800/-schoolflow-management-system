const bcrypt = require('bcryptjs');

exports.hashPassword = async (password) => bcrypt.hash(password, 12);
exports.comparePassword = (password, hash) => bcrypt.compare(password, hash);