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

describe('Service test by SendinBlue', ()=>{
    beforeAll(async ()=>{
        await emailerClienSetup(false)
    })

    const destinEmail = 'webfrontinapp@freemail.hu'

    it('Registration testing', (done)=>{
        EmailReportModel.find({msgto: destinEmail, msgtype: 'REGISTRATION'}, async (e, d)=>{
            expect(e).toBe(null)
            expect(typeof d).toBe('object')
            expect(d).toHaveLength(0)

            await emailingServices.registrationEmailSending('http://examplesite.com', 'Someone',
                destinEmail
            )
            setTimeout(()=>{
                EmailReportModel.find({msgto: destinEmail, msgtype: 'REGISTRATION'}, async (err, doc)=>{
                    expect(err).toBe(null)
                    expect(typeof doc).toBe('object')
                    expect(doc).toHaveLength(1)

                    expect(typeof doc[0].msgdate).toBe('object')
                    expect(doc[0].msgcontent).toBe('htmlPacked')
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
        EmailReportModel.find({msgto: destinEmail, msgtype: 'PWDRESETING'}, async (e, d)=>{
            expect(e).toBe(null)
            expect(typeof d).toBe('object')
            expect(d).toHaveLength(0)

            await emailingServices.passwordResettingEmailSending('http://examplesite.com', 
                'someone', destinEmail,  '01234567'
            )

            setTimeout(()=>{
                EmailReportModel.find({msgto: destinEmail, msgtype: 'PWDRESETING'}, async (err, doc)=>{
                    expect(err).toBe(null)
                    expect(typeof doc).toBe('object')
                    expect(doc).toHaveLength(1)

                    expect(typeof doc[0].msgdate).toBe('object')
                    expect(doc[0].msgcontent).toBe('htmlPacked')
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
        EmailReportModel.find({msgto: destinEmail, msgtype: 'ACCOUNTDELETE'}, async (e, d)=>{
            expect(e).toBe(null)
            expect(typeof d).toBe('object')
            expect(d).toHaveLength(0)

            await emailingServices.accountRemovalEmailSending('http://examplesite.com', 
                'someone', destinEmail
            )

            setTimeout(()=>{
                EmailReportModel.find({msgto: destinEmail, msgtype: 'ACCOUNTDELETE'}, async (err, doc)=>{
                    expect(err).toBe(null)
                    expect(typeof doc).toBe('object')
                    expect(doc).toHaveLength(1)

                    expect(typeof doc[0].msgdate).toBe('object')
                    expect(doc[0].msgcontent).toBe('htmlPacked')
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

    it('System testing emailing test', ()=>{
        EmailReportModel.find({msgto: destinEmail, msgtype: 'TESTING'}, async (e, d)=>{
            expect(e).toBe(null)
            expect(typeof d).toBe('object')
            expect(d).toHaveLength(0)

            await emailingServices.siteEmailerTesting('http://examplesite.com', 
                'someone', destinEmail
            )

            setTimeout(()=>{
                EmailReportModel.find({msgto: destinEmail, msgtype: 'TESTING'}, async (err, doc)=>{
                    expect(err).toBe(null)
                    expect(typeof doc).toBe('object')
                    expect(doc).toHaveLength(1)

                    expect(typeof doc[0].msgdate).toBe('object')
                    expect(doc[0].msgcontent).toBe('htmlPacked')
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