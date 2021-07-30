const jwt = require('jsonwebtoken')

const { tokenEncoder, tokenInputRevise, tokenVerify, createTokenToLink } 
    = require('../tokenManager')
const { TOKEN_SECRET, TOKEN_EXPIRE, TOKEN_PREFIX } = require('../../config/appConfig')

function giveTheSecOnly(time){
    const stringtime = time.toString().slice(0,10)
    return new Number(stringtime).valueOf()
}

describe('Token encoding tests', ()=>{
    it('Encoding test, expirence detection', async ()=>{
        const token = tokenEncoder({ msg: 'text of token' })
        return jwt.verify(token, TOKEN_SECRET, (err, decoded)=>{
            expect(err).toBe(null)
            expect(typeof decoded).toBe('object')
            expect(Object.keys(decoded).length).toEqual(3)
            expect(Object.keys(decoded)).toEqual(
                expect.arrayContaining(['msg','iat', 'exp'])
            )
            expect(decoded.msg).toBe('text of token')

            const actTimeMSec = new Date().getTime()
            const actTimeSec = giveTheSecOnly(actTimeMSec)
            expect(decoded.exp).toBeGreaterThan(actTimeSec)
            const diff = decoded.exp-actTimeSec
            expect(diff).toBeGreaterThan(3500)
        })
        
    })
})
describe('Token input revision tests', ()=>{
    it('Normal test', ()=>{
        const token = tokenEncoder({ msg: 'text' })
        const tokenHeader = TOKEN_PREFIX + token
        const tokenInput = { headers: { authorization: tokenHeader } }
        const revised = tokenInputRevise(tokenInput)

        expect(typeof revised).toBe('object')
        expect(Object.keys(revised)).toEqual(
            expect.arrayContaining(['takenText', 'tokenMissing'])
        )
        expect(revised.tokenMissing).toBeFalsy()
        expect(revised.takenText).toEqual(token)
    })
    it('No real header test', ()=>{
        const tokenInput = { headers: '' }
        const revised = tokenInputRevise(tokenInput)
        expect(typeof revised).toBe('object')
        expect(Object.keys(revised)).toEqual(
            expect.arrayContaining(['takenText', 'tokenMissing'])
        )
        expect(revised.tokenMissing).toBeTruthy()
        expect(revised.takenText).toBe(null)
    })
    it('No real authorization header test', ()=>{
        const tokenInput = { headers: { authorization: ''} }
        const revised = tokenInputRevise(tokenInput)
        expect(typeof revised).toBe('object')
        expect(Object.keys(revised)).toEqual(
            expect.arrayContaining(['takenText', 'tokenMissing'])
        )
        expect(revised.tokenMissing).toBeTruthy()
        expect(revised.takenText).toBe(null)
    })
    it('No prefixed authorization header test', ()=>{
        const token = tokenEncoder({ msg: 'text' })
        const tokenInput = { headers: { authorization: token } }
        const revised = tokenInputRevise(tokenInput)
        expect(typeof revised).toBe('object')
        expect(Object.keys(revised)).toEqual(
            expect.arrayContaining(['takenText', 'tokenMissing'])
        )
        expect(revised.tokenMissing).toBeTruthy()
        expect(revised.takenText).toBe(null)
    })
    it('Damaged schema token test', ()=>{
        const tokenParts = tokenEncoder({ msg: 'text' }).split('.')
        const token = tokenParts[0] + '.' + tokenParts[1] + tokenParts[2]
        const tokenInput = { headers: { authorization: token } }
        const revised = tokenInputRevise(tokenInput)
        expect(typeof revised).toBe('object')
        expect(Object.keys(revised)).toEqual(
            expect.arrayContaining(['takenText', 'tokenMissing'])
        )
        expect(revised.tokenMissing).toBeTruthy()
        expect(revised.takenText).toBe(null)
    })
})
describe('Token verification tests', ()=>{
    it('Normal test', async ()=>{
        const tokenContent = { id: '001', email: 'stg@testing.uk' }
        const token = jwt.sign(tokenContent, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRE } )
        
        const result = await tokenVerify( { tokenMissing: false, takenText: token})
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining([ 'id', 'email', 'accesPermission', 'isExpired', 'error', 'exp', 'iat' ])
        )

        expect(typeof result.accesPermission).toBe('boolean')
        expect(result.accesPermission).toBeTruthy()
        expect(typeof result.error).toBe('boolean')
        expect(result.error).toBeFalsy()
        expect(typeof result.isExpired).toBe('boolean')
        expect(result.isExpired).toBeFalsy()

        expect(result.id).toBe('001')
        expect(result.email).toBe('stg@testing.uk')
    })

    it('Token damaged schema', async ()=>{
        const tokenContent = { id: '001', email: 'stg@testing.uk' }
        const token = jwt.sign(tokenContent, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRE } )
        const badTokenParts = token.split('.')
        const badToken = badTokenParts[0] + '.' + badTokenParts[1] + badTokenParts[2]

        const result = await tokenVerify({ tokenMissing: false, takenText: badToken})
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining([ 'isExpired', 'error', 'accesPermission' ])
        )

        expect(typeof result.accesPermission).toBe('boolean')
        expect(result.accesPermission).toBeFalsy()
        expect(typeof result.error).toBe('object')
        expect(result.error.name).toBe('JsonWebTokenError')
        expect(result.error.message).toBe('jwt malformed')

        expect(typeof result.isExpired).toBe('boolean')
        expect(result.isExpired).toBeFalsy()
        expect(result.id).toBe(undefined)
        expect(result.email).toBe(undefined)
    })

    it('Token direct modified', async ()=>{
        const tokenContent = { id: '001', email: 'stg@testing.uk' }
        const token = jwt.sign(tokenContent, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRE } )
        const tokenParts = token.split('.')

        const targetToAlter = tokenParts[1].slice(3, 6)
        tokenParts[1] = tokenParts[1].replace(targetToAlter, 'abcdefghijk')
        const badToken = tokenParts.join('.')
        const result = await tokenVerify({ tokenMissing: false, takenText: badToken})
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining([ 'isExpired', 'error', 'accesPermission' ])
        )
        expect(typeof result.accesPermission).toBe('boolean')
        expect(result.accesPermission).toBeFalsy()
        expect(typeof result.error).toBe('object')
        expect(typeof result.isExpired).toBe('boolean')
        expect(result.isExpired).toBeFalsy()
        expect(result.id).toBe(undefined)
        expect(result.email).toBe(undefined)
    })

    it('Token mission, no login state', async ()=>{

        const result = await tokenVerify({ tokenMissing: true, takenText: ''})
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining([ 'isExpired', 'error', 'accesPermission' ])
        )
        expect(typeof result.accesPermission).toBe('boolean')
        expect(result.accesPermission).toBeFalsy()
        expect(typeof result.error).toBe('boolean')
        expect(result.error).toBeFalsy()
        expect(typeof result.isExpired).toBe('boolean')
        expect(result.isExpired).toBeFalsy()
        expect(result.id).toBe(undefined)
        expect(result.email).toBe(undefined)
    })
})

describe('Special key handle, email token processes', ()=>{
    it('Encode token with external security key, verify manually', ()=>{
        const token = tokenEncoder({ id: '1234' }, '123')
        const actTime = new Date().getTime().toString().slice(0, 10)
        const theTimeSec = new Number(actTime)
        expect(typeof token).toBe('string')

        jwt.verify(token, '123', (err, decoded)=>{
            expect(err).toBe(null)

            expect(typeof decoded).toBe('object')
            expect(Object.keys(decoded)).toEqual(
                expect.arrayContaining(['iat', 'exp', 'id' ])
            )
            expect(decoded.id).toBe('1234')
            expect(decoded.exp).toEqual(theTimeSec + 3600)
        })
    })

    it('Verify token with external security key, encode manually', async ()=>{
        const theToken = jwt.sign({ mark: 'abcd' }, '123', { expiresIn: '1m' })

        const result = await tokenVerify(
            { tokenMissing: false, takenText: theToken}, '123'
        )
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['iat', 'exp', 'isExpired', 'error', 'accesPermission', 'mark'])
        )
        expect(typeof result.error).toBe('boolean')
        expect(result.error).toBeFalsy()
        expect(result.isExpired).toBeFalsy()
        expect(result.mark).toBe('abcd')
    })

    it('Full encode and verify token with external security key', async ()=>{
        const token = tokenEncoder({ mark: 'efgh' }, '123')
        
        const result = await tokenVerify(
            { tokenMissing: false, takenText: token}, '123'
        )
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['iat', 'exp', 'isExpired', 'error', 'mark'])
        )
        expect(typeof result.error).toBe('boolean')
        expect(result.error).toBeFalsy()
        expect(result.isExpired).toBeFalsy()
        expect(result.mark).toBe('efgh')
    })

    it('Faulty encode and verify token with external security key', async ()=>{
        const token = tokenEncoder({ mark: '0987' }, '123')
        const actTime = new Date().getTime().toString().slice(0, 10)
        const theTimeSec = new Number(actTime)
        
        const result = await tokenVerify(
            { tokenMissing: false, takenText: token}, '1234'
        )
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['isExpired', 'error'])
        )
        expect(typeof result.error).toBe('object')
        expect(result.isExpired).toBeFalsy()
    })
})
describe('Password reset case, TokenToLinkURL creation testion', ()=>{
    it('TokenToLinkURL creation', async ()=>{
        const dateToContAndSecret = new Date().getTime()
        const url = createTokenToLink(dateToContAndSecret, 'fdfgvl4d4g%!FF', '012345678')

        const parts = url.split('.')
        expect(parts[0]).toBe('012345678')

        const tokenPart = parts[1] + '.' + parts[2] + '.' + parts[3]
        const result = await tokenVerify({ takenText: tokenPart, tokenMissing: false},
             dateToContAndSecret + 'fdfgvl4d4g%!FF')

        expect(result.marker).toBe(dateToContAndSecret)
        expect(typeof result.accesPermission).toBe('boolean')
        expect(result.accesPermission).toBeTruthy()
        expect(typeof result.error).toBe('boolean')
        expect(result.error).toBeFalsy()
        expect(typeof result.isExpired).toBe('boolean')
        expect(result.isExpired).toBeFalsy()
    })
})