const mongoose = require('mongoose')

const EmailReportSchema = new mongoose.Schema({
    msgdate: String,
    msgto: String,
    msgtype: String,
    msgcontent: String,
    msgresult: String
})

module.exports = mongoose.model('emailreports', EmailReportSchema )