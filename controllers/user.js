const bcrypt = require('bcryptjs');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const verifyAccount = require('../emails/verifyAccount.js');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const crypto = require('crypto-js');
const forgotPasswordMail = require('../emails/forgotPassword.js');

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

        const checkUser = await User.findUser(email);

        if(checkUser) {
            const error = new Error('You are signed up! Log in!');
            throw error;
        }

        const user = new User(firstName, lastName, email, hashPassword);

        const savedUser = await user.save(); 

        const savedUserDetails = await User.findUser(email);

        const verificationToken = jwt.sign({
            email: savedUserDetails.email,
            userId: savedUserDetails._id,
        },
        'verificationsecretprivatekey',
        {expiresIn: '1h'}
        )

        const info = await transport.sendMail({
            from: '24CARATBOT',
            to: email,
            subject: "Verify your account",
            //text: "Hello world?",
            html: verifyAccount(verificationToken),
            headers: { 'x-cloudmta-class': 'standard' }
        })

        console.log(info.response); 

        res.status(201).send({message: 'User created', code: 201, savedUser: savedUser});
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

        const decodedToken = jwt.verify(token, 'verificationsecretprivatekey');
        console.log(decodedToken);

        if(!decodedToken) {
            const error = new Error('Not authenticated'); 
            throw error;
        }

        const user = await User.findUser(decodedToken.email);

        if (!user) {
            const error = new Error( 'User not found!');
            throw error;
        }
        
        const id =  ObjectId(user._id);

        const updatedUser = await User.updateUserVerification(id);

        const updatedSavedUser = await User.findUser(decodedToken.email);

        res.status(201).send({hasError: false, code: 201, message: 'Your account is verified!', updatedSavedUser: updatedSavedUser});
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

        const savedUser = await User.findUser(email);
        //console.log(savedUser);

        if(!savedUser) { 
            const error = new Error('User not found! sign up!');
            throw error;
        }

        const checkPassword = bcrypt.compareSync(password, savedUser.password); 
        //console.log(checkPassword);
        if(!checkPassword) {
            const error = new Error('Wrong password!') 
            throw error;
        }

        
        const token = sign({
            userId: savedUser._id,
            email: savedUser.email,
        },
        'usersecretprivatekey',
        {expiresIn: '10h'}
        );

        res.status(200).send({hasError: false, code: 200, message: 'Logged In!', user: savedUser, token: token});

    } catch(error) {
        next(error);
    }

}

exports.forgotPassword = async (req, res, next) => {

    try {

        const email = req.body.email;

        const savedUser = await User.findUser(email);
    
        if(!savedUser) {
            const error = new Error('User does not exist!');
            throw error;
        }
    
        console.log(savedUser);
    
        const id = ObjectId(savedUser._id);
    
        let password = crypto.randomBytes(10).toString('hex'); 
        console.log(password);
    
        const hashPassword = await bcrypt.hash(password, 10);
    
        const updatedUser = await User.updatePassword(id, hashPassword);
    
        const info = await transport.sendMail({
            from: '24CARATBOT',
            to: email,
            subject: "Forgot Password",
            //text: "Hello world?",
            html: forgotPasswordMail(password),
            headers: { 'x-cloudmta-class': 'standard' }
        })
    
        console.log(info.response);  
    
        const updatedSavedUser = await User.findUser(email);
    
        res.status(201).send({hasError: false, code: 201, message: 'Password sent to email!', updatedUser: updatedSavedUser});  

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

        const decodedToken = jwt.verify(token, 'usersecretprivatekey');
        console.log(decodedToken);

        if(!decodedToken) {
            const error = new Error('Not authenticated'); 
            throw error;
        }

        const id = ObjectId(decodedToken.userId); 
        const email = decodedToken.email;

        const user = await User.findUser(email);

        if (!user) {
            const error = new Error('User not found!');
            throw error;
        }

        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;

        const checkPassword = bcrypt.compareSync(oldPassword, user.password);

        if(!checkPassword) {
            const error = new Error('Wrong old password');
            throw error;
        }

        if (oldPassword === newPassword) {
            const error = new Error('New password can not be the same with old password. Enter new password.');
            throw error;
        }

        const hashNewPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await User.updatePassword(id, hashNewPassword);

        const updatedSavedUser = await User.findUser(email);

        res.status(201).send({hasError: false, code: 201, message: 'Password has been reset!', updatedUser: updatedSavedUser, oldPassword: oldPassword, newPassword: newPassword});

    } catch(error) {
        console.log(error);
        next(error);
    }

}

exports.subPayment = async (req, res, next) => {
    
}