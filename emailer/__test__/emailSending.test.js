const mongoose = require('mongoose')

const DB_CONN = require('../../config/dbConfig').dbLocal
const { setupTrsp, execMailSending, emailType } = require('../emailerSetup')

describe.skip('Functional emailing tests', ()=>{
    beforeAll(()=>{
        setupTrsp();
        mongoose.connect(DB_CONN, { useNewUrlParser: true, useUnifiedTopology: true })
        
    })
    afterAll(()=>{
        mongoose.connection.close()
    })
    it('Registration emailing', async ()=>{
        expect.assertions(5);
        const sending = await execMailSending('notknown@gmail.com', emailType.REGISTRATION)
        expect(sending.progress).toBe('done')
        expect(sending.quality).not.toBe(undefined)
        expect(sending.quality).toBe('subjReg;txtLoaded;mlLoaded')
        expect(sending.resultId).not.toBe(undefined)
        expect(sending.resultId).not.toBe(null)
    })
    it('Deletion emailing', async ()=>{
        expect.assertions(5);
        const sending = await execMailSending('notknown@gmail.com', emailType.ACCOUNTDELETE)
        expect(sending.progress).toBe('done')
        expect(sending.quality).not.toBe(undefined)
        expect(sending.quality).toBe('subjDel;txtLoaded;mlLoaded')
        expect(sending.resultId).not.toBe(undefined)
        expect(sending.resultId).not.toBe(null)
    })
    it('Password emailing', async ()=>{
        expect.assertions(5);
        const sending = await execMailSending('notknown@gmail.com', emailType.PWDRESETING, {
            anchUrl: 'https://google.com',
            anchTxt: 'STG TO TEST THE TOKEN INSERTION'
        })
        expect(sending.progress).toBe('done')
        expect(sending.quality).not.toBe(undefined)
        expect(sending.quality).toBe('subjPwdReset;txtLoaded;mlLoaded')
        expect(sending.resultId).not.toBe(undefined)
        expect(sending.resultId).not.toBe(null)
    })
})