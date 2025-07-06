const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || "yoursecret";
const ACCESS_EXPIRY = "15m";
const REFRESH_EXPIRY = "7d";

module.exports = {
    createAccessToken: (payload) => ({
        token: jwt.sign(payload, SECRET, { expiresIn: ACCESS_EXPIRY }),
        exp: new Date(Date.now() + 15 * 60 * 1000)
    }),
    createRefreshToken: (payload) => ({
        token: jwt.sign(payload, SECRET, { expiresIn: REFRESH_EXPIRY }),
        exp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })
};
