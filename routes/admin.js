const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin.js');

const isAdminAuth =  require('../middlewares/isAdminAuth.js');

router.put('/signup', adminController.signup);

router.get('/verify/:token', adminController.verify);

router.post('/login', adminController.login);

router.post('/forgotpassword', adminController.forgotPassword);

router.patch('/resetpassword', adminController.resetPassword);

router.post('/update-profit', isAdminAuth, adminController.updateProfit);

router.get('/get-all-profit', isAdminAuth, adminController.getAllProfit);

router.get('/get-unvalidated-users', isAdminAuth, adminController.getUnvalidatedUsers);

router.patch('/validate-user/:userId', isAdminAuth, adminController.validateUser);

router.get('/get-all-users', isAdminAuth, adminController.getAllUsers);

router.get('/get-all-subusers', isAdminAuth, adminController.getAllSubUsers);

router.get('/get-all-managedusers', isAdminAuth, adminController.getAllManagedUsers);

router.get('/get-all-withdrawals', isAdminAuth, adminController.getAllWithdrawals);

router.get('/get-user/:userId', isAdminAuth, adminController.getUser);

module.exports = router;