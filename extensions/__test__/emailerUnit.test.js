const nodemailer = require('nodemailer')
const SibApiV3Sdk = require('sib-api-v3-sdk');
/*const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

/*
const EmailReportModel = require('../../models/EmailReportModel')
const localURL = require('../../config/dbConfig').dbLocal
*/

const { EMAIL_CONNECTION_ETHEREAL, EMAIL_CONNECTION_SENDINBLUE_APIKEY 
    } = require('../../config/emailConfig')

const { LinkProvider,  emailType, emailTypeIDParser 
    } = require('../emailerComponents/linkProvider')
const { getTheComponentSourcePath, getTheFetchedReplacedContent 
    } = require('../emailerComponents/emailContentLoader')
const etherealSend = require('../emailerComponents/etherealSendingService')
const sendinblueSend = require('../emailerComponents/sendinblueSendingService')



describe('Loaders tests', ()=>{

    it('Defining the sourcepath from root', ()=>{
        const res = getTheComponentSourcePath(['..', '__test__','emailTestPublic'])
        expect(res).toEqual(
            expect.stringMatching(/server\\extensions\\__test__\\emailTestPublic$/)
        )
    })

    it('Link object testing', ()=>{
        const obj = new LinkProvider('Click me here', 'someMarkerText')
        const res1 = obj.getTheProperLink('text')
        expect(res1).toEqual('')

        const res2 = obj.getTheProperLink('html')
        expect(res2).toEqual(
            expect.stringMatching(/<a href="">Click me here<\/a>/)
        )
        const res3 = obj.getTheDestinationMarkerText()
        expect(res3).toEqual('someMarkerText')

        obj.setLinkUrl('http://example.com')
        const res4 = obj.getTheProperLink('html')
        expect(res4).toEqual(
            expect.stringMatching(/<a href="http:\/\/example.com">Click me here<\/a>/)
        )

    })

    it('Fetch in a string from file', async ()=>{
        const path = getTheComponentSourcePath(['..', '__test__','emailTestPublic'])
        const links = [ new LinkProvider('Read more...', '<!--PlaceOfTheInsert-->') ]
        links[0].setLinkUrl('http://example.net')

        const htmlExpected = [
            /<h3>Some content for Testing<\/h3>/,
            '<a href="http://expample.net>Reade more...</a>'
        ]
        const txtExpected = [
            /Some content for Testing/,
            /http:\/\/example.net/
        ]
        
        const resObj1 = await getTheFetchedReplacedContent(links, path, 'testEmailContent.html')
        expect(resObj1.content).toMatch(htmlExpected[0] )
        //expect(resObj1.content.includes(htmlExpected[1])).toBeTruthy()
        expect(resObj1.report).toBe('htmlPacked')

        const resObj2 = await getTheFetchedReplacedContent(links, path, 'testEmailContent.txt')
        expect(resObj2.content).toMatch(txtExpected[0])
        expect(resObj2.content).toMatch(txtExpected[1])
        expect(resObj2.report).toBe('txtPacked')

    })

})
/*
describe('DB logging test', ()=>{
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
})
*/
describe('Singel Ethereal EmailerService tests', ()=>{
    
    let theTransporter = null
    let service = null
    beforeAll(async ()=>{
        theTransporter = nodemailer.createTransport(EMAIL_CONNECTION_ETHEREAL)
        //mongoose.connect(localURL, { useNewUrlParser: true, useUnifiedTopology: true })
        service = await new etherealSend('nothing', theTransporter,
            //correlated to service component
            [ '..', '__test__','emailTestPublic' ], 
            { html: 'testEmailContent.html', txt: 'testEmailContent.txt' },
            'An object text',
            [  new LinkProvider( 'CulturalSpot',  '<!--PlaceOfTheInsert-->' ) ]
        )
        service.setUrlOfLinks(['http://example.com'])
    })
    afterAll(()=>{
        theTransporter.close()
    })

    it('Sending test', async()=>{

        const result = await service.executeEmailSending('Somebody', 'someReally@good.com')
        expect(typeof result).toBe('object')
        expect(result.emailTo).toBe('someReally@good.com')
        expect(result.messageType).toBe('UNKNOWN')
        expect(typeof result.messageContent).toBe('object')
        expect(result.messageContent.length).toBe(2)
        expect(result.messageContent[0]).toBe('txtPacked')
        expect(result.messageContent[1]).toBe('htmlPacked')
        expect(result.sendingResult).toBe('sent')
    })
})

describe('Sigel SendinBlue EmailerService tests', ()=>{

    let theTransporter = null
    let service = null
    beforeAll(async ()=>{
        theTransporter = SibApiV3Sdk.ApiClient.instance;
        const apiKey = theTransporter.authentications['api-key'];
        apiKey.apiKey = EMAIL_CONNECTION_SENDINBLUE_APIKEY

        service = await new sendinblueSend('nothing', undefined,
            //correlated to service component
            [ '..', '__test__','emailTestPublic' ], 
            { html: 'testEmailContent.html', txt: 'testEmailContent.txt' },
            'An object text',
            [  new LinkProvider( 'CulturalSpot',  '<!--PlaceOfTheInsert-->' ) ]
        )
        service.setUrlOfLinks(['http://example.com'])
    })

    it('Sending test', async()=>{
        const result = await service.executeEmailSending('Somebody', 'webfrontinapp@freemail.hu')
        expect(typeof result).toBe('object')
        expect(result.emailTo).toBe('webfrontinapp@freemail.hu')
        expect(result.messageType).toBe('UNKNOWN')
        expect(typeof result.messageContent).toBe('object')
        expect(result.messageContent.length).toBe(1)
        expect(result.messageContent[0]).toBe('htmlPacked')
        expect(result.sendingResult).toBe('sent')
    })
})