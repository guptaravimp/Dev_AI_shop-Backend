const express = require('express');
const multer = require('multer');
const { createUser, loginUser, logoutUser, purchaseProduct, getAllYourOrders } = require('../controllers/userController');
const router = express.Router();

router.post('/signup', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/purchase', purchaseProduct);
router.get('/orders/:userId', getAllYourOrders);

module.exports = router;
