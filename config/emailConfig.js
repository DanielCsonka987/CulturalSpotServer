const emailCred = []
try{
    const { EMAIL_TRANSPORT_TEST, EMAIL_TRANSPORT_PROD, EMAIL_FROM_ADDR 
        } = require('./secureConfig')
    emailCred['FROM_ADDR'] = EMAIL_FROM_ADDR
    emailCred['TEST_HOST'] = EMAIL_TRANSPORT_TEST.HOST
    emailCred['TEST_PORT'] = EMAIL_TRANSPORT_TEST.PORT
    emailCred['TEST_USER'] = EMAIL_TRANSPORT_TEST.UN
    emailCred['TEST_PWD'] = EMAIL_TRANSPORT_TEST.PWD
    emailCred['PROD_HOST'] = EMAIL_TRANSPORT_PROD.HOST
    emailCred['PROD_PORT'] = EMAIL_TRANSPORT_PROD.PORT
    emailCred['PROD_USER'] = EMAIL_TRANSPORT_PROD.UN
    emailCred['PROD_PWD'] = EMAIL_TRANSPORT_PROD.PWD
}catch(err) { }

module.exports = {

    EMAIL_ORIGIN_ACCOUNT: emailCred['FROM_ADDR'],

    EMAIL_CONNECTION_FORTEST: {
        host: emailCred['TEST_HOST'],
        port: emailCred['TEST_PORT'],
        auth: {
            user: emailCred['TEST_USER'],
            pass: emailCred['TEST_PWD']
        }
    },
    EMAIL_CONNECTION_PRODUCTION: {
        service: process.env.MAIL_HOST || emailCred['PROD_HOST'],
        //port: process.env.PORT_MAIL || emailCred['PROD_PORT'],
        auth: {
            user: process.env.USER || emailCred['PROD_USER'],
            pass: process.env.PWD || emailCred['PROD_PWD']
        }
    }
}