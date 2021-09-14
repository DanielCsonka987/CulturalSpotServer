const nodemailer = require('nodemailer')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

const EmailReportModel = require('../../models/EmailReportModel')
const localURL = require('../../config/dbConfig').dbLocal
const {EMAIL_CONNECTION_FORTEST } = require('../../config/emailConfig')

const { EmailingService, LinkProvider  } = require('../emailerComponents/emailerService')


describe('Singel EmailerService tests', ()=>{

    let theTransporter = null
    let service = null
    beforeAll(()=>{
        theTransporter = nodemailer.createTransport(EMAIL_CONNECTION_FORTEST)
        mongoose.connect(localURL, { useNewUrlParser: true, useUnifiedTopology: true })
        service = new EmailingService(
            -1, theTransporter,
            //correlated to service component
            { toRoot: ['..'], toContent: ['__test__','emailTestPublic']}, 
            { html: 'testEmailContent.html', txt: 'testEmailContent.txt' },
            'An object text',
            [
                new LinkProvider(
                    'http://localhost:4040', '/somepath/01234', 'CulturalSpot', 
                         '<!--PlaceOfTheInsert-->'
                )
            ]
        )
    })
    afterAll(()=>{
        theTransporter.close()
        mongoose.disconnect()

    })
    it('Path definition test', ()=>{
        const publicFolderPath = service.getTheComponentPath()

        expect(typeof publicFolderPath).toBe('string')
        expect(publicFolderPath.endsWith('server\\extensions\\__test__\\emailTestPublic')).toBeTruthy()
    })
    it('Test of filefetch', async ()=>{
        const file = await service.getTheContentFromFile(
            path.join(__dirname, './emailTestPublic'),'testEmailContent.txt'
        )

        expect(typeof file).toBe('string')
        expect(file.search('Some content for Testing')).toBe(0)
    })

    it('Test of content processing', async ()=>{
        const file = await service.getTheContentFromFile(
            path.join(__dirname, './emailTestPublic'), 'testEmailContent.txt'
        )
        expect(typeof file).toBe('string')
        expect(file.search('Some content for Testing')).toBe(0)
        expect(file.includes('<!--PlaceOfTheInsert-->')).toBeTruthy()
        expect(file.includes('http://localhost:4040/somepath/01234')).toBeFalsy()

        const content = service.getTheFormattedContent(file, 'Text')
        expect(typeof content).toBe('string')
        expect(content.includes('<!--PlaceOfTheInsert-->')).toBeFalsy()
        expect(content.includes('http://localhost:4040/somepath/01234')).toBeTruthy()
    })
    it('Test of DB registring', (done)=>{
        EmailReportModel.find({msgto: 'someReally@good.com'}, async (e, d)=>{
            expect(e).toBe(null)
            expect(typeof d).toBe('object')
            expect(d).toHaveLength(0)

            await service.registerInDBTheSending({
                emailTo: 'someReally@good.com',
                messageType: 'noType',
                messageContent: [ 'no', 'there' ],
                sendingResult: 'sent'
            })
            setTimeout(()=>{
                EmailReportModel.find({ msgto: 'someReally@good.com'}, (err, doc)=>{
                    expect(err).toBe(null)
                    expect(doc).not.toBe(null)

                    expect(typeof doc).toBe('object')
                    expect(doc).toHaveLength(1)
                    expect(doc[0].msgtype).toBe('noType')
                    expect(doc[0].msgcontent).toBe('no-there')
                    expect(doc[0].msgresult).toBe('sent')

                    EmailReportModel.deleteOne({_id: doc[0]._id}, (error, docum)=>{
                        expect(error).toBe(null)
                        done()
                    })
                })
            }, 800)

        })
    })

    it('Whole comoponent test', (done)=>{
        EmailReportModel.find({msgto: 'someReally@good.com'}, async (e, d)=>{
            expect(e).toBe(null)
            expect(typeof d).toBe('object')
            expect(d).toHaveLength(0)

            await service.executeEmailSending('someReally@good.com')

            setTimeout(()=>{

                EmailReportModel.find({ msgto: 'someReally@good.com'}, (err, doc)=>{
                    expect(err).toBe(null)
                    expect(doc).not.toBe(null)

                    expect(typeof doc).toBe('object')
                    expect(doc).toHaveLength(1)
                    expect(doc[0].msgtype).toBe('UNKNOWN')
                    expect(doc[0].msgcontent).toBe('textPacked-htmlPacked')
                    expect(doc[0].msgresult).toBe('sent')

                    EmailReportModel.deleteOne({_id: doc[0]._id}, (error, docum)=>{
                        expect(error).toBe(null)
                        done()
                    })
                })

            }, 700)
        })
    })

})
