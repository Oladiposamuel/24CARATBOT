const mongodb = require('mongodb');
const { getDb } = require('../utils/database.js');

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
}

module.exports = Withdrawal;