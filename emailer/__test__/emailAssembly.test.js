const fs = require('fs')
const path = require('path')

const { testingAssembleEmail, emailType  } = require('../emailerSetup')

describe('Email messages processings', ()=>{
    
    it('Registration answer', async ()=>{
        expect.assertions(6);
        const res = await testingAssembleEmail(emailType.REGISTERATION, '')

        expect(typeof res).toBe('object')
        expect(Object.keys(res)).toEqual(
            expect.arrayContaining(['subj', 'txt', 'ml'])
        )
        expect(typeof res.subj).toBe('string')
        expect(res.subj).toBe('Your CulturalSpot registration')
        expect(typeof res.txt).toBe('string')
        expect(typeof res.ml).toBe('string')
        
        const thePath = path.join(__dirname, '..', 'emailTextingSrc', 'registration')

        await Promise.resolve(()=>{

            fs.readFile(thePath + '.txt', 'utf8', (err, data)=>{
                //expect.assertions(2);
                expect(err).toBe(null)
                expect(res.txt).toBe(data)
            })
        })
        await Promise.resolve(()=>{

            fs.readFile(thePath + '.html', 'utf8', (err, data)=>{
                //expect.assertions(2);
                expect(err).toBe(null)
                expect(res.ml).toBe(data)

            })
        })
    })

    it('Account deletion answer', async ()=>{
        expect.assertions(6);
        const res = await testingAssembleEmail(emailType.ACCOUNTDELETE, '')

        expect(typeof res).toBe('object')
        expect(Object.keys(res)).toEqual(
            expect.arrayContaining(['subj', 'txt', 'ml'])
        )
        expect(typeof res.subj).toBe('string')
        expect(res.subj).toBe('Your CulturalSpot account is deleted')
        expect(typeof res.txt).toBe('string')
        expect(typeof res.ml).toBe('string')

        const thePath = path.join(__dirname, '..', 'emailTextingSrc', 'deleteAccount')

        await Promise.resolve(()=>{

            fs.readFile(thePath + '.txt', 'utf8', (err, data)=>{
                expect(err).toBe(null)
                expect(res.txt).toBe(data)
            })
        })
        await Promise.resolve(()=>{

            fs.readFile(thePath + '.html', 'utf8', (err, data)=>{
                expect(err).toBe(null)
                expect(res.ml).toBe(data)

            })
        })
    })

    it('Password reseting answer', async ()=>{
        expect.assertions(6);
        const res = await testingAssembleEmail(emailType.PWDRESETING, 'find_some_text')

        expect(typeof res).toBe('object')
        expect(Object.keys(res)).toEqual(
            expect.arrayContaining(['subj', 'txt', 'ml'])
        )
        expect(typeof res.subj).toBe('string')
        expect(res.subj).toBe('NO_REPLY! CulturalSpot password resetting')
        expect(typeof res.txt).toBe('string')
        expect(typeof res.ml).toBe('string')

        const thePath = path.join(__dirname, '..', 'emailTextingSrc', 'resetPassword')

        await Promise.resolve(()=>{
            fs.readFile(thePath + '.txt', 'utf8', (err, data)=>{
                expect.assertions(2);
                expect(err).toBe(null)

                const final = data.replace('/*PlaceOfTheInsert*/', 'find_some_text')
                expect(res.txt).toEqual(final)
            })
        })
        await Promise.resolve(()=>{
            fs.readFile(thePath + '.html', 'utf8', (err, data)=>{
                expect.assertions(2);
                expect(err).toBe(null)
                
                const tag = `<a href="find_some_text">find_some_text</a>`
                const final = data.replace('<!-- PlaceOfTheInsert -->', tag)
                console.log(final)
                expect(res.ml).toEqual(final)
    
            })
        })
    })
})