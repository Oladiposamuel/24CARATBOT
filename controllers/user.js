const bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config();
const User = require('../models/user');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const verifyAccount = require('../emails/verifyAccount.js');
const renewSubscription = require('../emails/renewSubscription.js');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const crypto = require('crypto');
// const crypto = require('crypto-random-string');
const forgotPasswordMail = require('../emails/forgotPassword.js');
const coinbase = require('coinbase-commerce-node');
const schedule = require('node-schedule');

const Client = coinbase.Client;
Client.init(process.env.COINBASE_API_KEY);
const Charge = coinbase.resources.Charge;

const Webhook = require('coinbase-commerce-node').Webhook;


let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'Oladiposamuel.ola@gmail.com',
        pass: 'aolmxoeuckpveapn'
    }
})

exports.signupSub = async (req, res, next) => {
  
    try {  
        const firstName = req.body.firstName.toLowerCase();
        const lastName = req.body.lastName.toLowerCase();
        const email = req.body.email.toLowerCase();
        const password = req.body.password;
        const referrerCode = req.body.referrerCode.toLowerCase();

        let salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const checkUser = await User.findUser(email);

        if(checkUser) {
            const error = new Error('You are signed up! Log in!');
            throw error;
        }

        let myReferralCode = crypto.randomBytes(3).toString('hex');
        console.log(myReferralCode);

        const user = new User(firstName, lastName, email, hashPassword, myReferralCode);

        const savedUser = await user.save(); 

        await User.updateSubAccountType(email);

        if(referrerCode) {
            await User.updateReferrerCode(email, referrerCode);
        }

        const savedUserDetails = await User.findUser(email);

        if (savedUserDetails.accountType === "subscription account") {

            const date = new Date();
            date.setSeconds(date.getSeconds() + 20);
            console.log(date);

            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            const hour = date.getHours();
            const minute = date.getMinutes();
            const second = date.getSeconds();

            const sevenToDate = new Date(year, month, day, hour, minute, second);

            const job = schedule.scheduleJob(sevenToDate, async function (){
                console.log('Warning! 7 days left to renew your subscription')
                // const info = await transport.sendMail({
                //     from: '24CARATBOT',
                //     to: email,
                //     subject: "Renew your account subscription",
                //     //text: "Hello world?",
                //     html: renewSubscription(lastName),
                //     headers: { 'x-cloudmta-class': 'standard' }
                // })
        
                // console.log(info.response); 
                twoToDate(); 
            });

            const twoToDate = () => {
                const date = new Date();
                date.setSeconds(date.getSeconds() + 20);

                const year = date.getFullYear();
                const month = date.getMonth();
                const day = date.getDate();
                const hour = date.getHours();
                const minute = date.getMinutes();
                const second = date.getSeconds();

                const twoToDate = new Date(year, month, day, hour, minute, second);

                const job = schedule.scheduleJob(twoToDate, function(){
                    console.log('Warning! 2 days left to renew your subscription');
                    onTaskDate();
                });
            }

            const onTaskDate = () => {
                const date = new Date();
                date.setSeconds(date.getSeconds() + 20);

                const year = date.getFullYear();
                const month = date.getMonth();
                const day = date.getDate();
                const hour = date.getHours();
                const minute = date.getMinutes();
                const second = date.getSeconds();

                const onTaskDate = new Date(year, month, day, hour, minute, second);

                const job = schedule.scheduleJob(onTaskDate, function(){
                    console.log('Renew today! Your subscription is due today');
                });
            }

        }

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

        res.status(201).send({message: 'User created', code: 201, savedUser: savedUser, verificationToken: verificationToken});
    } catch (error) {
        next(error);
    }

}

exports.signupManaged = async (req, res, next) => {
  
    try {  
        const firstName = req.body.firstName.toLowerCase();
        const lastName = req.body.lastName.toLowerCase();
        const email = req.body.email.toLowerCase();
        const password = req.body.password;

        let salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const checkUser = await User.findUser(email);

        if(checkUser) {
            const error = new Error('You are signed up! Log in!');
            throw error;
        }

        let myReferralCode = crypto.randomBytes(3).toString('hex');
        console.log(myReferralCode);

        const user = new User(firstName, lastName, email, hashPassword, myReferralCode);

        const savedUser = await user.save(); 

        await User.updateManagedAccountType(email);

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

        res.status(201).send({message: 'User created', code: 201, savedUser: savedUser, verificationToken: verificationToken});
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
        const email = req.body.email.toLowerCase();
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

        
        const token = jwt.sign({
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

        const email = req.body.email.toLowerCase();

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

    try {

        const email = req.email;

        const savedUser = await User.findUser(email);
        const id = savedUser._id;
        const lastName = savedUser.lastName;
        
        const chargeData = {
            name: "Subscription payment",
            description: "payment for subscription platform",
            local_price: {
              amount: 10,
              currency: "USD",
            },
            pricing_type: "fixed_price",
            metadata: {
              customer_id: id,
              customer_name: lastName,
            },
            redirect_url: `https://a573-102-89-40-111.eu.ngrok.io/user/success-payment`, 
            cancel_url: `https://a573-102-89-40-111.eu.ngrok.io/user/cancel-payment`,
        };
        
        const charge = await Charge.create(chargeData);
    
        console.log(charge);
    
        res.status(201).send({hasError: false, code: 201, message: 'Charge for subscription account payment has been created', charge: charge});

    } catch(error) {
        next(error)
    }

}

exports.successPayment = async (req, res, next) => {
    res.send({message: 'payment successful'});
}

exports.cancelPayment = async (req, res, next) => {
    res.send ({message: 'payment cancelled'});
}

exports.paymentHandler = async (req, res, next) => {

  const rawBody = req.rawBody;
  const signature = req.headers["x-cc-webhook-signature"];
  const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET;

  let event;

  try {
    event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);
    // console.log(event);

    if (event.type === "charge:pending") {
      // received order
      // user paid, but transaction not confirm on blockchain yet
      console.log("pending payment");
    }

    if (event.type === "charge:confirmed") {
      // fulfill order
      // charge confirmed
      console.log("charge confirmed");
    }

    if (event.type === "charge:failed") {
      // cancel order
      // charge failed or expired
      console.log("charge failed"); 
    }

    res.send(`success ${event.id}`);
  } catch (error) {
    console.log(error);
  }
}

exports.managedAccountPayment = async (req, res, next) => {

    try {

        const email = req.email;

        const savedUser = await User.findUser(email);
        const id = savedUser._id;
        const lastName = savedUser.lastName;
        
        const chargeData = {
            name: "Managed Account payment",
            description: "payment for managed account platform",
            local_price: {
              amount: 100,
              currency: "USD",
            },
            pricing_type: "fixed_price",
            metadata: {
              customer_id: id,
              customer_name: lastName,
            },
            redirect_url: `https://a573-102-89-40-111.eu.ngrok.io/user/success-payment`, 
            cancel_url: `https://a573-102-89-40-111.eu.ngrok.io/user/cancel-payment`,
        };

        if(chargeData.local_price.amount < 100) {
            const error = new Error('Enter a different amount. Minimum amount is 100');
            throw error;
        }
        
        const charge = await Charge.create(chargeData);
    
        console.log(charge);
    
        res.status(201).send({hasError: false, code: 201, message: 'charge for managed account payment has been created', charge: charge});


    } catch(error) {
        next(error);
    }

}

exports.submitTradingDetails = async (req, res, next) => {

    try {

        const id = ObjectId(req.userId);
        const email = req.email;
        const tradingDetails = req.body.tradingDetails;

        const updateTradingDetails = await User.updateTradingDetails(id, tradingDetails);

        const savedUser = await User.findUser(email);

        res.status(201).send({hasError: false, code: 201, message: 'trading details updated!', user: savedUser});

    } catch(error) {
        next(error);
    }

}