const mongodb = require('mongodb');
const { getDb } = require('../utils/database.js');

class Profit {
    constructor(profitPercentage) {
        this.profitPercentage = profitPercentage;
        this.dateAdded = new Date();
    }

    save() {
        const db = getDb();
        return db.collection('profit').insertOne(this)
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log(error);
        })
    }

    static findAllProfit() {
        const db = getDb();
        return db.collection('profit').find().toArray()
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log(error);
        })
    }
}

module.exports = Profit;