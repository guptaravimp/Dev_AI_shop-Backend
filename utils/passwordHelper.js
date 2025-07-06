const bcrypt = require('bcryptjs');

module.exports = {
    hashPassword: (password) => bcrypt.hashSync(password, 10),
    comparePassword: (password, hash) => bcrypt.compareSync(password, hash)
};
