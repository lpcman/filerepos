const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: String,
    password: String,
    salt: String,
    token: String,
    createAt: Date
});

module.exports = mongoose.model('User', schema, 'users');