const { DB_CREDENTIALS } = require('./secureConfig')

const dbName = process.env.DB_NAME || DB_CREDENTIALS.DB
const dbUser = process.env.DB_USER || DB_CREDENTIALS.USER
const dbPwd = process.env.DB_PWD || DB_CREDENTIALS.PWD

module.exports.dbLocal = 
    'mongodb://localhost:27017/'+ dbName 
    +'?readPreference=primary&appname=MongoDB%20Compass&ssl=false'
module.exports.dbCloud = `mongodb+srv://${dbUser}:${dbPwd}`
   + `@cluster0.rols0.mongodb.net/${dbName}?retryWrites=true&w=majority`