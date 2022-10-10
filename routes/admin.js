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

router.get('/get-unvalidated-users', isAdminAuth, adminController.getUnvalidatedUsers);

router.patch('/validate-user/:userId', isAdminAuth, adminController.validateUser);


module.exports = router;