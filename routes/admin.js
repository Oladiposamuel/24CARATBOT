const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin.js');

router.put('/signup', adminController.signup);

router.get('/verify/:token', adminController.verify);

router.post('/login', adminController.login);

router.post('/forgotpassword', adminController.forgotPassword);

router.patch('/resetpassword', adminController.resetPassword);

module.exports = router;