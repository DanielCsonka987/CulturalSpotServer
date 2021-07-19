const mongoose = require('mongoose')

const DB_CONN = require('../../config/dbConfig').dbLocal
const { setupTrsp, execMailSending, emailType } = require('../emailerSetup')

describe('Functional emailing tests', ()=>{
    beforeAll(()=>{
        setupTrsp();
        mongoose.connect(DB_CONN, { useNewUrlParser: true, useUnifiedTopology: true })
        
    })
    afterAll(()=>{
        mongoose.connection.close()
    })
    it('Registration emailing', async ()=>{
        const res = await execMailSending('notknown@gmail.com', emailType.REGISTRATION)
        expect(res.messageId).not.toBe(undefined)
        expect(res.messageId).not.toBe(null)
    })
    it('Deletion emailing', async ()=>{
        const res = await execMailSending('notknown@gmail.com', emailType.ACCOUNTDELETE)
        expect(res.messageId).not.toBe(undefined)
        expect(res.messageId).not.toBe(null)
    })
    it('Password emailing', async ()=>{
        const res = await execMailSending('notknown@gmail.com', emailType.PWDRESETING, {
            anch: 'STG TO TEST THE TOKEN INSERTION'
        })
        expect(res.messageId).not.toBe(undefined)
        expect(res.messageId).not.toBe(null)
    })
})