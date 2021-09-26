const dbCred = []
try{
    const { DB_CREDENTIALS } = require('./secureConfig')
    dbCred['DB'] = DB_CREDENTIALS.DB
    dbCred['USER'] = DB_CREDENTIALS.USER
    dbCred['PWD'] = DB_CREDENTIALS.PWD
}catch(err) { }

const dbName = process.env.DB_NAME || dbCred['DB']
const dbUser = process.env.DB_USER || dbCred['USER']
const dbPwd = process.env.DB_PWD || dbCred['PWD']

module.exports.dbLocal = 
    'mongodb://localhost:27017/'+ dbName 
    +'?readPreference=primary&appname=MongoDB%20Compass&ssl=false'
module.exports.dbCloud = `mongodb+srv://${dbUser}:${dbPwd}`
   + `@cluster0.rols0.mongodb.net/${dbName}?retryWrites=true&w=majority`