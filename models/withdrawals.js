const mongodb = require('mongodb');
const { getDb } = require('../utils/database.js');
const ObjectId = mongodb.ObjectId;

class Withdrawal {
    constructor(user, amount) {
        this.user = user;
        this.amount = amount;
        this.status = "pending";
        this.dateAdded = new Date();
    }

    save() {
        const db = getDb();
        return db.collection('withdrawals').insertOne(this)
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log(error);
        })
    }

    static getAllWithdrawals() {
        const db = getDb();
        return db.collection('withdrawals').find().toArray()
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log(error);
        })
    }

    static getWithdrawalById(id) {
        const db = getDb();
        return db.collection('withdrawals').findOne({_id: id})
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log(error);
        })
    } 

    static getWithdrawalRequests() {
        const db = getDb();
        return db.collection('withdrawals').find({status: "pending"}).toArray()
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log(error);
        })
    }

    static confirmWithdrawalRequest(id) {
        const db = getDb();
        return db.collection('withdrawals').updateOne({_id: id}, {$set: { status: "processed" }})
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log(error);
        })
    }
}

module.exports = Withdrawal;