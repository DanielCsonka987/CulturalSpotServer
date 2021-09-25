const mongoose = require('mongoose')

const EmailReportSchema = new mongoose.Schema({
    msgdate: Date,
    msgto: String,
    msgtype: String,
    msgcontent: String,
    msgresult: String
})

module.exports = mongoose.model('emailreports', EmailReportSchema )