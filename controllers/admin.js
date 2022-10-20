const bcrypt = require('bcryptjs');
const Admin = require('../models/admin.js');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const verifyAccount = require('../emails/verifyAccount.js');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const crypto = require('crypto');
const forgotPasswordMail = require('../emails/forgotPassword.js');
const User = require('../models/user.js');
const Withdrawal = require('../models/withdrawals.js');
const Profit = require('../models/profit.js');

let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'Oladiposamuel.ola@gmail.com',
        pass: 'aolmxoeuckpveapn'
    }
})

exports.signup = async (req, res, next) => {
  
    try {  
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;

        let salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const checkAdmin = await Admin.findAdmin(email);

        if(checkAdmin) {
            const error = new Error('You are signed up! Log in!');
            throw error;
        }

        const admin = new Admin(firstName, lastName, email, hashPassword);

        const savedAdmin = await admin.save(); 

        const savedAdminDetails = await Admin.findAdmin(email);

        const verificationToken = jwt.sign({
            email: savedAdminDetails.email,
            adminId: savedAdminDetails._id,
        },
        'verificationadminsecretprivatekey', 
        {expiresIn: '1h'}
        )

        const personnel = 'admin';

        const info = await transport.sendMail({
            from: '24CARATBOT',
            to: email,
            subject: "Verify your account",
            //text: "Hello world?",
            html: verifyAccount(personnel, verificationToken, firstName),
            headers: { 'x-cloudmta-class': 'standard' }
        })

        console.log(info.response); 

        res.status(201).send({message: 'Admin created', code: 201, savedAdmin: savedAdminDetails});
    } catch (error) {
        next(error);
    }

}

exports.verify = async (req, res, next) => {

    try {
        const token = req.params.token;
        
        if (!token) {
            const error = new Error('token not found!');
            throw error;
        }

        const decodedToken = jwt.verify(token, 'verificationadminsecretprivatekey');
        console.log(decodedToken);

        if(!decodedToken) {
            const error = new Error('Not authenticated'); 
            throw error;
        }

        const admin = await Admin.findAdmin(decodedToken.email);

        if (!admin) {
            const error = new Error( 'Admin not found!');
            throw error;
        }
        
        const id =  ObjectId(admin._id);

        const updatedAdmin = await Admin.updateAdminVerification(id)

        const updatedSavedAdmin = await Admin.findAdmin(decodedToken.email);

        res.status(201).send({hasError: false, code: 201, message: 'Your account is verified!', updatedSavedAdmin: updatedSavedAdmin});
        // console.log(__dirname);
        // res.status(201).sendFile(__dirname + "/verificationPage.html");

    } catch(error) {
        console.log(error);
        next(error);
    }
}

exports.login = async (req, res, next) => {

    try {
        const email = req.body.email;
        const password = req.body.password;

        const savedAdmin = await Admin.findAdmin(email);
        //console.log(savedUser);

        if(!savedAdmin) { 
            const error = new Error('Admin not found! sign up!');
            throw error;
        }

        const checkPassword = bcrypt.compareSync(password, savedAdmin.password); 
        //console.log(checkPassword);
        if(!checkPassword) {
            const error = new Error('Wrong password!') 
            throw error;
        }

        if (!savedAdmin.isAdmin) {
            const error = new Error('You are yet to verify your account! Please verify your account.');
            throw error;
        }

        
        const token = jwt.sign({
            adminId: savedAdmin._id,
            email: savedAdmin.email,
        },
        'adminsecretprivatekey',
        {expiresIn: '10h'}
        );

        res.status(200).send({hasError: false, code: 200, message: 'Logged In!', admin: savedAdmin, token: token});

    } catch(error) {
        next(error);
    }

}

exports.forgotPassword = async (req, res, next) => {

    try {

        const email = req.body.email;

        const savedAdmin = await Admin.findAdmin(email);
    
        if(!savedAdmin) {
            const error = new Error('Admin does not exist!');
            throw error;
        }
    
        console.log(savedAdmin);
    
        const id = ObjectId(savedAdmin._id);
    
        let password = crypto.randomBytes(10).toString('hex'); 
        console.log(password);
    
        const hashPassword = await bcrypt.hash(password, 10);
    
        const updatedAdmin = await Admin.updatePassword(id, hashPassword);
    
        const info = await transport.sendMail({
            from: '24CARATBOT',
            to: email,
            subject: "Forgot Password",
            //text: "Hello world?",
            html: forgotPasswordMail(password),
            headers: { 'x-cloudmta-class': 'standard' }
        })
    
        console.log(info.response);  
    
        const updatedSavedAdmin = await Admin.findAdmin(email);
    
        res.status(201).send({hasError: false, code: 201, message: 'Password sent to email!', updatedAdmin: updatedSavedAdmin});  

    } catch (error) {
        next(error);
    }

}

exports.resetPassword = async (req, res, next) => {

    try{
        const authHeader = req.get('Authorization');

        if (!authHeader) {
            const error = new Error('Header not found!');
            throw error;
        }

        const token = authHeader.split(' ')[1];

        const decodedToken = jwt.verify(token, 'adminsecretprivatekey');
        console.log(decodedToken);

        if(!decodedToken) {
            const error = new Error('Not authenticated'); 
            throw error;
        }

        const id = ObjectId(decodedToken.adminId); 
        const email = decodedToken.email;

        const admin = await Admin.findAdmin(email);

        if (!admin) {
            const error = new Error('User not found!');
            throw error;
        }

        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;

        const checkPassword = bcrypt.compareSync(oldPassword, admin.password);

        if(!checkPassword) {
            const error = new Error('Wrong old password');
            throw error;
        }

        if (oldPassword === newPassword) {
            const error = new Error('New password can not be the same with old password. Enter new password.');
            throw error;
        }

        const hashNewPassword = await bcrypt.hash(newPassword, 10);

        const updatedAdmin = await Admin.updatePassword(id, hashNewPassword);

        const updatedSavedAdmin = await Admin.findAdmin(email);

        res.status(201).send({hasError: false, code: 201, message: 'Password has been reset!', updatedAdmin: updatedSavedAdmin, oldPassword: oldPassword, newPassword: newPassword});

    } catch(error) {
        console.log(error);
        next(error);
    }

}

exports.updateProfit = async (req, res, next) => {

    try {

        const amount = req.body.amount;
        const profit = new Profit(amount);
        const savedProfit = profit.save();

        res.status(201).send({hasError: false, code: 201, message: 'Profit updated'});

    } catch (error) {
        next(error);
    }
}

exports.getAllProfit = async (req, res, next) => {

    try {

        const allProfit = await Profit.findAllProfit();

        res.status(200).send({hasError: false, code: 200, message: 'All Profit', allProfit: allProfit});

    } catch(error) {
        next(error);
    }

}

exports.getUnvalidatedUsers = async (req, res, next) => {

    try {
        
        const unvalidatedUsers = await User.getUnvalidatedUsers();
        res.status(200).send({hasError: false, code: 200, message: 'unvalidated users', unvalidatedUsers: unvalidatedUsers});

    } catch (error) {
        next(error);
    }

}

exports.validateUser = async (req, res, next) => {

    try {

        const userId = ObjectId(req.params.userId);

        const user = await User.validateUser(userId);

        const updatedUser = await User.findUserById(userId);

        res.status(201).send({hasError: false, code: 201, message: 'User account validated', updatedUser: updatedUser});

        } catch(error) {
        next(error);
    }

}

exports.getAllUsers = async (req, res, next) => {

    try {
        const allUsers = await User.findAllUsers();

        res.status(200).send({hasError: false, code: 200, message: 'All Users', allUsers: allUsers});
    } catch(error) {
        next(error);
    }

}

exports.getAllSubUsers = async (req, res, next) => {

    try {

        const subUsers = await User.getAllSubUsers();

        res.status(200).send({hasError: false, code: 200, message: 'All Users', subUsers: subUsers});

    } catch(error) {
        next(error);
    }
}

exports.getAllManagedUsers = async (req, res, next) => {

    try {

        const managedUsers = await User.getAllManagedUsers();

        res.status(200).send({hasError: false, code: 200, message: 'All Users', managedUsers: managedUsers});

    } catch(error) {
        next(error);
    }

}

exports.getAllWithdrawals = async (req, res, next) => {
    try{

        const allWithdrawals = await Withdrawal.getAllWithdrawals();

        res.status(200).send({hasError: false, code: 200, message: 'All Withdrawals', allWithdrawals: allWithdrawals});

    } catch(error) {
        next(error);
    }
}

exports.getUser = async (req, res, next) => {

    try {

        const id = ObjectId(req.params.userId);

        const user = await User.findUserById(id);

        res.status(200).send({hasError: false, code: 200, message: 'User data', user: user});

    } catch(error) {
        next(error);
    }

}

