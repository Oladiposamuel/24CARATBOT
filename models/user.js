const mongodb = require('mongodb');
const { getDb } = require('../utils/database.js');

class User {
    constructor(firstName, lastName, email, password, myReferralCode) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.myReferralCode = myReferralCode;
        this.referrerCode = null;
        this.isVerified = false;
        this.tradingDetails = null;
        this.accountStatus = "not validated";
        this.accountType = null;
    }

    save() {
        const db = getDb();
        return db.collection('user').insertOne(this)
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log(error);
        })
    }

    static findUser(email) {
        const db = getDb();
        return db.collection('user').findOne({email: email})
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log(error);
        })
    }

    static updateUserVerification(id) {
        const db = getDb();
        return db.collection('user').updateOne({_id: id}, {$set: {isVerified: true}})
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log(error);
        })
    }

    static updatePassword(id, hashPassword) {
        const db = getDb();
        return db.collection('user').updateOne({_id: id}, {$set: {password: hashPassword}})
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log(error);
        })
    }

    static updateTradingDetails(id, tradingDetails) {
        const db = getDb();
        return db.collection('user').updateOne({_id: id}, {$set: { tradingDetails: tradingDetails }})
        .then(result => {
            return result;
        })
        .catch(error=> {
            console.log(error);
        })
    }

    static updateReferrerCode(email, referrerCode) {
        const db = getDb();
        return db.collection('user').updateOne({email: email}, {$set: { referrerCode: referrerCode }})
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log(error);
        })
    }

    static updateSubAccountType(email) {
        const db = getDb();
        return db.collection('user').updateOne({email: email}, {$set: { accountType: "subscription account" }})
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log(error);
        })
    }

    static updateManagedAccountType(email) {
        const db = getDb();
        return db.collection('user').updateOne({email: email}, {$set: { accountType: "managed account" }})
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log(error);
        })
    }
}

module.exports = User;