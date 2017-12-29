const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: String,
    desc: String,
    tag: String,
    checksum: String,
    location: String,
    filename: String,
    createAt: Date
});

module.exports = mongoose.model('File', schema, 'files');