const emailCred = []
try{
    const { EMAIL_TRANSPORT_TEST, EMAIL_TRANSPORT_PROD, EMAIL_FROM_ADDR, EMAIL_TEST_ADDR
        } = require('./secureConfig')
    emailCred['FROM_ADDR'] = EMAIL_FROM_ADDR
    emailCred['TEST_ADDR'] = EMAIL_TEST_ADDR
    emailCred['TEST_HOST'] = EMAIL_TRANSPORT_TEST.HOST
    emailCred['TEST_PORT'] = EMAIL_TRANSPORT_TEST.PORT
    emailCred['TEST_USER'] = EMAIL_TRANSPORT_TEST.UN
    emailCred['TEST_PWD'] = EMAIL_TRANSPORT_TEST.PWD
    emailCred['API_KEY'] = EMAIL_TRANSPORT_PROD.API_KEY
}catch(err) { }

module.exports = {

    EMAIL_ORIGIN_ACCOUNT: 
        process.env.EMAIL_SENDER_ADDRESS || emailCred['FROM_ADDR'],
    EMAIL_TEST_ACCOUNT: 
        process.env.EMAIL_TEST_ADDRESS || emailCred['TEST_ADDR'],

    EMAIL_CONNECTION_ETHEREAL: {
        host: emailCred['TEST_HOST'],
        port: emailCred['TEST_PORT'],
        auth: {
            user: emailCred['TEST_USER'],
            pass: emailCred['TEST_PWD']
        }
    },
    EMAIL_CONNECTION_SENDINBLUE_APIKEY: 
        process.env.EMAIL_API_KEY || emailCred['API_KEY']
}