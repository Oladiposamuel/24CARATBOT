const express = require('express');

const router = express.Router();

const userController = require('../controllers/user.js');

const isUserAuth = require('../middlewares/isUserAuth.js');

router.put('/signup-sub', userController.signupSub);

router.put('/signup-managed', userController.signupManaged);

router.get('/verify/:token', userController.verify);

router.post('/login', userController.login);

router.post('/forgot-password', userController.forgotPassword);

router.patch('/reset-password', userController.resetPassword);

router.get('/sub-payment', isUserAuth, userController.subPayment);

router.get('/success-payment', isUserAuth, userController.successPayment);

router.get('/cancel-payment', userController.cancelPayment);

router.post('/payment-handler', isUserAuth, userController.paymentHandler);

router.get('/managedaccount-payment', isUserAuth, userController.managedAccountPayment);

router.post('/trading-details', isUserAuth, userController.submitTradingDetails);

module.exports = router;