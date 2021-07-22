const fs = require('fs')
const path = require('path')

const { testingAssembleEmail, emailType, emailTypeStringify  } = require('../emailerSetup')

describe('Email messages processings', ()=>{
    
    it('Registration answer', async ()=>{
        expect.assertions(8);
        const res = await testingAssembleEmail(emailType.REGISTRATION, undefined)

        expect(typeof res).toBe('object')
        expect(Object.keys(res)).toEqual(
            expect.arrayContaining(['subj', 'txt', 'ml', 'integrity' ])
        )
        expect(typeof res.subj).toBe('string')
        expect(res.subj).toBe('Your CulturalSpot registration')
        expect(typeof res.txt).toBe('string')
        expect(typeof res.ml).toBe('string')
        expect(typeof res.integrity).toBe('object')
        expect(Object.values(res.integrity)).toEqual(
            ['subjReg', 'txtLoaded', 'mlLoaded' ]
        )
        
        const thePath = path.join(__dirname, '..', 'emailTextingSrc', 'registration')

        await Promise.resolve(()=>{
            fs.readFile(thePath + '.txt', 'utf8', (err, data)=>{
                expect.assertions(2);
                expect(err).toBe(null)
                expect(res.txt).toBe(data)
            })
        })
        await Promise.resolve(()=>{
            fs.readFile(thePath + '.html', 'utf8', (err, data)=>{
                expect.assertions(2);
                expect(err).toBe(null)
                expect(res.ml).toBe(data)

            })
        })
    })

    it('Account deletion answer', async ()=>{
        expect.assertions(8);
        const res = await testingAssembleEmail(emailType.ACCOUNTDELETE, undefined)

        expect(typeof res).toBe('object')
        expect(Object.keys(res)).toEqual(
            expect.arrayContaining(['subj', 'txt', 'ml', 'integrity' ])
        )
        expect(typeof res.subj).toBe('string')
        expect(res.subj).toBe('Your CulturalSpot account is deleted')
        expect(typeof res.txt).toBe('string')
        expect(typeof res.ml).toBe('string')
        expect(typeof res.integrity).toBe('object')
        expect(Object.values(res.integrity)).toEqual(
            ['subjDel', 'txtLoaded', 'mlLoaded' ]
        )

        const thePath = path.join(__dirname, '..', 'emailTextingSrc', 'deleteAccount')

        await Promise.resolve(()=>{
            expect.assertions(2);

            fs.readFile(thePath + '.txt', 'utf8', (err, data)=>{
                expect(err).toBe(null)
                expect(res.txt).toBe(data)
            })
        })
        await Promise.resolve(()=>{
            expect.assertions(2);

            fs.readFile(thePath + '.html', 'utf8', (err, data)=>{
                expect(err).toBe(null)
                expect(res.ml).toBe(data)

            })
        })
    })

    it('Password reseting answer', async ()=>{
        expect.assertions(8);
        const res = await testingAssembleEmail(
            emailType.PWDRESETING, { 
                anchUrl: 'https://google.com/',
                anchTxt: 'find_some_text' } 
        )

        expect(typeof res).toBe('object')
        expect(Object.keys(res)).toEqual(
            expect.arrayContaining(['subj', 'txt', 'ml', 'integrity' ])
        )
        expect(typeof res.subj).toBe('string')
        expect(res.subj).toBe('NO_REPLY! CulturalSpot password resetting')
        expect(typeof res.txt).toBe('string')
        expect(typeof res.ml).toBe('string')
        expect(typeof res.integrity).toBe('object')
        expect(Object.values(res.integrity)).toEqual(
            ['subjPwdReset', 'txtLoaded', 'mlLoaded' ]
        )

        const thePath = path.join(__dirname, '..', 'emailTextingSrc', 'resetPassword')

        await Promise.resolve(()=>{
            fs.readFile(thePath + '.txt', 'utf8', (err, data)=>{
                expect.assertions(2);
                expect(err).toBe(null)

                const final = data.replace('/*PlaceOfTheInsert*/', 'https://google.com/')
                expect(res.txt).toEqual(final)
            })
        })
        await Promise.resolve(()=>{
            fs.readFile(thePath + '.html', 'utf8', (err, data)=>{
                expect.assertions(2);
                expect(err).toBe(null)
                
                const tag = `<a href="https://google.com/">find_some_text</a>`
                const final = data.replace('<!-- PlaceOfTheInsert -->', tag)
                console.log(final)
                expect(res.ml).toEqual(final)
    
            })
        })
    })
})

describe('Email type stringify test', ()=>{
    it('Proper values', ()=>{
        const res1 = emailTypeStringify(emailType.REGISTRATION)
        expect(res1).toBe('REGISTRATION')
        const res2 = emailTypeStringify(emailType.PWDRESETING)
        expect(res2).toBe('PWDRESETING')
        const res3 = emailTypeStringify(emailType.ACCOUNTDELETE)
        expect(res3).toBe('ACCOUNTDELETE')
    })
    it('Unprooper value', ()=>{
        const res1 = emailTypeStringify(-1)
        expect(res1).toBe('UNKNOWN')
    })
})