const express = require('express');

const router = express.Router();

const userController = require('../controllers/user.js');

const isUserAuth = require('../middlewares/isUserAuth.js');

router.put('/signup-sub', userController.signupSub);

router.put('/signup-managed', userController.signupManaged);

router.get('/verify/:token', userController.verify);

router.post('/login', userController.login);

router.post('/forgot-password', userController.forgotPassword);

router.patch('/reset-password', isUserAuth, userController.resetPassword);

router.get('/sub-payment', isUserAuth, userController.subPayment);

router.post('/deposit-payment', isUserAuth, userController.depositPayment);

router.get('/success-payment', isUserAuth, userController.successPayment);

router.get('/cancel-payment', userController.cancelPayment);

router.post('/payment-handler', isUserAuth, userController.paymentHandler);

router.get('/managedaccount-payment', isUserAuth, userController.managedAccountPayment);

router.post('/trading-details', isUserAuth, userController.submitTradingDetails);

router.get('/get-user-details', isUserAuth, userController.getUserDetails);

router.post('/withdrawal-request', isUserAuth, userController.withdrawalRequest);

router.get('/get-profit', isUserAuth, userController.getProfit);

router.get('/test', userController.test);

module.exports = router;