const mongoose = require('mongoose')

const EmailReportModel = require('../../models/EmailReportModel')
const localURL = require('../../config/dbConfig').dbCloud

const { emailingServices, emailerClienSetup, emailerClienShutdown 
    } = require('../emailerClientSetup')

beforeAll(()=>{
    mongoose.connect(localURL, { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll((done)=>{
    setTimeout(()=>{
        mongoose.disconnect()
        done()
    }, 1000)
})

describe('Services test with Ethereal', ()=>{
    beforeAll(async ()=>{
        await emailerClienSetup(true)
    })
    afterAll((done)=>{
        setTimeout(async ()=>{
            await emailerClienShutdown
            done()
        }, 500)
    })

    const inputs = [ 
        'anemail@nowhere.com', 'another@somewhere.uk', 'hereMail@mailbox.it',
        'example@mailer.net'
     ]

    it('Registration testing', (done)=>{
        const actInput = inputs[0]
        EmailReportModel.find({msgto: actInput}, async (e, d)=>{
            expect(e).toBe(null)
            expect(typeof d).toBe('object')
            expect(d).toHaveLength(0)

            setTimeout(async ()=>{
                await emailingServices.registrationEmailSending('http://examplesite.com',
                    'Someone', actInput
                )
            }, 600)

            setTimeout(()=>{
                EmailReportModel.find({msgto: actInput}, async (err, doc)=>{
                    expect(err).toBe(null)
                    expect(typeof doc).toBe('object')
                    expect(doc).toHaveLength(1)

                    expect(typeof doc[0].msgdate).toBe('object')
                    expect(doc[0].msgtype).toBe('REGISTRATION')
                    expect(doc[0].msgcontent).toBe('txtPacked-htmlPacked')
                    expect(doc[0].msgresult).toBe('sent')

                    EmailReportModel.deleteOne({_id: doc[0]._id}, async (error, docum)=>{
                        expect(error).toBe(null)
                        expect(typeof docum).toBe('object')

                        done()
                    })
                })
            }, 1500)

        })
    })

    it('ResetPassword testing', (done)=>{
        const actInput = inputs[1]
        EmailReportModel.find({msgto: actInput}, async (e, d)=>{
            expect(e).toBe(null)
            expect(typeof d).toBe('object')
            expect(d).toHaveLength(0)

            await emailingServices.passwordResettingEmailSending('http://examplesite.com', 
                'someone', actInput,  '01234567'
            )

            setTimeout(()=>{
                EmailReportModel.find({msgto: actInput}, async (err, doc)=>{
                    expect(err).toBe(null)
                    expect(typeof doc).toBe('object')
                    expect(doc).toHaveLength(1)

                    expect(typeof doc[0].msgdate).toBe('object')
                    expect(doc[0].msgtype).toBe('PWDRESETING')
                    expect(doc[0].msgcontent).toBe('txtPacked-htmlPacked')
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

            await emailingServices.accountRemovalEmailSending('http://examplesite.com', 
                'someone', actInput
            )

            setTimeout(()=>{
                EmailReportModel.find({msgto: actInput}, async (err, doc)=>{
                    expect(err).toBe(null)
                    expect(typeof doc).toBe('object')
                    expect(doc).toHaveLength(1)

                    expect(typeof doc[0].msgdate).toBe('object')
                    expect(doc[0].msgtype).toBe('ACCOUNTDELETE')
                    expect(doc[0].msgcontent).toBe('txtPacked-htmlPacked')
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

    it('System testing emailing test', (done)=>{
        const actInput = inputs[3]
        EmailReportModel.find({msgto: actInput}, async (e, d)=>{
            expect(e).toBe(null)
            expect(typeof d).toBe('object')
            expect(d).toHaveLength(0)

            await emailingServices.siteEmailerTesting('http://examplesite.com', 
                'someone', actInput
            )

            setTimeout(()=>{
                EmailReportModel.find({msgto: actInput}, async (err, doc)=>{
                    expect(err).toBe(null)
                    expect(typeof doc).toBe('object')
                    expect(doc).toHaveLength(1)

                    expect(typeof doc[0].msgdate).toBe('object')
                    expect(doc[0].msgtype).toBe('TESTING')
                    expect(doc[0].msgcontent).toBe('txtPacked-htmlPacked')
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