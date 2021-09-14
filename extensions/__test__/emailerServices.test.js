const mongoose = require('mongoose')

const EmailReportModel = require('../../models/EmailReportModel')
const localURL = require('../../config/dbConfig').dbLocal

const { emailingServices, emailerClienSetup, emailerClienShutdown 
    } = require('../emailerClientSetup')

beforeAll(async ()=>{
    mongoose.connect(localURL, { useNewUrlParser: true, useUnifiedTopology: true })
    await emailerClienSetup
})

afterAll(async ()=>{
    mongoose.disconnect()
    await emailerClienShutdown
})

describe('Services test', ()=>{
    const inputs = [ 'anEmail@nowhere.com', 'another@somewhere.uk', 'hereMail@mailbox.it' ]

    it('Registration testing', (done)=>{
        const actInput = inputs[0]
        EmailReportModel.find({msgto: actInput}, async (e, d)=>{
            expect(e).toBe(null)
            expect(typeof d).toBe('object')
            expect(d).toHaveLength(0)

            await emailingServices.registrationEmailSending('http://exampleSite.com')
                .executeEmailSending(actInput)

            setTimeout(()=>{
                EmailReportModel.find({msgto: actInput}, async (err, doc)=>{
                    expect(err).toBe(null)
                    expect(typeof doc).toBe('object')
                    expect(doc).toHaveLength(1)

                    expect(typeof doc[0].msgdate).toBe('string')
                    expect(doc[0].msgtype).toBe('REGISTRATION')
                    expect(doc[0].msgcontent).toBe('textPacked-htmlPacked')
                    expect(doc[0].msgresult).toBe('sent')

                    EmailReportModel.deleteOne({_id: doc[0]._id}, async (error, docum)=>{
                        expect(error).toBe(null)
                        expect(typeof docum).toBe('object')

                        done()
                    })
                })
            }, 700)

        })
    })

    it('ResetPassword testing', (done)=>{
        const actInput = inputs[1]
        EmailReportModel.find({msgto: actInput}, async (e, d)=>{
            expect(e).toBe(null)
            expect(typeof d).toBe('object')
            expect(d).toHaveLength(0)

            await emailingServices.passwordResettingEmailSending('https:/somesite.it', '01234567')
            .executeEmailSending(actInput)

            setTimeout(()=>{
                EmailReportModel.find({msgto: actInput}, async (err, doc)=>{
                    expect(err).toBe(null)
                    expect(typeof doc).toBe('object')
                    expect(doc).toHaveLength(1)

                    expect(typeof doc[0].msgdate).toBe('string')
                    expect(doc[0].msgtype).toBe('PWDRESETING')
                    expect(doc[0].msgcontent).toBe('textPacked-htmlPacked')
                    expect(doc[0].msgresult).toBe('sent')

                    EmailReportModel.deleteOne({_id: doc[0]._id}, async (error, docum)=>{
                        expect(error).toBe(null)
                        expect(typeof docum).toBe('object')

                        done()
                    })
                })
            }, 700)

        })
    })

    it('AccountRemoval testing', (done)=>{
        const actInput = inputs[2]
        EmailReportModel.find({msgto: actInput}, async (e, d)=>{
            expect(e).toBe(null)
            expect(typeof d).toBe('object')
            expect(d).toHaveLength(0)

            await emailingServices.accountRemovalEmailSending('https:/somesite.it')
            .executeEmailSending(actInput)

            setTimeout(()=>{
                EmailReportModel.find({msgto: actInput}, async (err, doc)=>{
                    expect(err).toBe(null)
                    expect(typeof doc).toBe('object')
                    expect(doc).toHaveLength(1)

                    expect(typeof doc[0].msgdate).toBe('string')
                    expect(doc[0].msgtype).toBe('ACCOUNTDELETE')
                    expect(doc[0].msgcontent).toBe('textPacked-htmlPacked')
                    expect(doc[0].msgresult).toBe('sent')

                    EmailReportModel.deleteOne({_id: doc[0]._id}, async (error, docum)=>{
                        expect(error).toBe(null)
                        expect(typeof docum).toBe('object')

                        done()
                    })
                })
            }, 700)

        })
    })
})