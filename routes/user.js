const express = require('express');

const router = express.Router();

const userController = require('../controllers/user.js');

router.put('/signup', userController.signup);

router.get('/verify/:token', userController.verify);

router.post('/login', userController.login);

router.post('/forgotpassword', userController.forgotPassword);

router.patch('/resetpassword', userController.resetPassword);

router.get('/subpayment', userController.subPayment);

module.exports = router;