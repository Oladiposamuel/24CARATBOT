const mongodb = require('mongodb');
const { getDb } = require('../utils/database.js');

class User {
    constructor(firstName, lastName, email, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.isVerified = false;
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
}

module.exports = User;