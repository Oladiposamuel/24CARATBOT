const mongodb = require('mongodb');
const { getDb } = require('../utils/database.js');

class Admin {
    constructor(firstName, lastName, email, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.isAdmin = false;
        this.dateAdded = new Date();
    }

    save() {
        const db = getDb();
        return db.collection('admin').insertOne(this)
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log(error);
        })
    }

    static findAdmin(email) {
        const db = getDb();
        return db.collection('admin').findOne({email: email})
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log(error);
        })
    }

    static updateAdminVerification(id) {
        const db = getDb();
        return db.collection('admin').updateOne({_id: id}, {$set: {isAdmin: true}})
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log(error);
        })
    }

    static updatePassword(id, hashPassword) {
        const db = getDb();
        return db.collection('admin').updateOne({_id: id}, {$set: {password: hashPassword}})
        .then(result => {
            return result;
        })
        .catch(error => {
            console.log(error);
        })
    }
}

module.exports = Admin;