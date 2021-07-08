const { DB_CREDENTIALS } = require('./secureConfig')

module.exports.dbLocal = 
    'mongodb://localhost:27017/'+ DB_CREDENTIALS.DB 
    +'?readPreference=primary&appname=MongoDB%20Compass&ssl=false'
module.exports.dbCloud = ''