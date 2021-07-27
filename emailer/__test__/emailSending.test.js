const { setupTrsp, execMailSending, emailType } = require('../emailerSetup')

describe('Functional emailing tests', ()=>{
    const inputs = [
        'notknown1@gmail.com', 'notknown2@gmail.com', 'notknown3@gmail.com'
    ]
    beforeAll((done)=>{
        setupTrsp.then(()=>{
            done()
        });
    })
    afterAll(()=>{

    })
    it('Registration emailing', async ()=>{
        const targEmail = inputs[0]
        expect.assertions(5);
        const sending = await execMailSending(targEmail, emailType.REGISTRATION)
        expect(sending.progress).toBe('done')
        expect(sending.integrity).not.toBe(undefined)
        expect(sending.integrity).toBe('subjReg_txtLoaded_mlLoaded')
        expect(sending.resultId).not.toBe(undefined)
        expect(sending.resultId).not.toBe(null)
    })
    it('Deletion emailing', async ()=>{
        const targEmail = inputs[1]
        expect.assertions(5);
        const sending = await execMailSending(targEmail, emailType.ACCOUNTDELETE)
        expect(sending.progress).toBe('done')
        expect(sending.integrity).not.toBe(undefined)
        expect(sending.integrity).toBe('subjDel_txtLoaded_mlLoaded')
        expect(sending.resultId).not.toBe(undefined)
        expect(sending.resultId).not.toBe(null)
    })
    it('Password emailing', async ()=>{
        const targEmail = inputs[2]
        expect.assertions(5);
        const sending = await execMailSending(targEmail, emailType.PWDRESETING, {
            anchUrl: 'https://google.com',
            anchTxt: 'STG TO TEST THE TOKEN INSERTION'
        })
        expect(sending.progress).toBe('done')
        expect(sending.integrity).not.toBe(undefined)
        expect(sending.integrity).toBe('subjPwdReset_txtLoaded_mlLoaded')
        expect(sending.resultId).not.toBe(undefined)
        expect(sending.resultId).not.toBe(null)
    })
})