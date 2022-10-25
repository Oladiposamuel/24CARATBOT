const mongodb = require('mongodb');
const { getDb } = require('../utils/database.js');

class Transaction {
    constructor(userId, status, amount, accountType) {
        this.userId = userId;
        this.status = status;
        this.amount = amount;
        this.accountType = accountType;
        this.dateAdded = new Date(); 
    }

    save() {
        const db = getDb();
        return db.collection('transactions').insertOne(this)
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log(error);
        })
    }
}

module.exports = Transaction;