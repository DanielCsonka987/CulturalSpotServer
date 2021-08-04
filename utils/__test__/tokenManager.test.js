const jwt = require('jsonwebtoken')

const { autorizTokenEncoder, authorizTokenInputRevise, authorizTokenVerify, 
    createTokenToLink, resoluteTokenFromLink, verifyTokenFromLink,
    createRefreshToken, loginRefreshTokenInputRevise, loginRefreshTokenValidate } 
    = require('../tokenManager')
const { TOKEN_SECRET, TOKEN_ACCESS_EXPIRE, 
    TOKEN_RESET_EXPIRE, TOKEN_PREFIX } = require('../../config/appConfig')

function giveTheSecOnly(time){
    const stringtime = time.toString().slice(0,10)
    return new Number(stringtime).valueOf()
}

describe('Token encoding tests', ()=>{
    it('Encoding test, expirence detection', async ()=>{
        const token = autorizTokenEncoder({ msg: 'text of token' })
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
            expect(diff).toBeGreaterThanOrEqual(900)
        })
        
    })
})
describe('Token input revision tests', ()=>{
    it('Normal test', ()=>{
        const token = autorizTokenEncoder({ msg: 'text' })
        const tokenHeader = TOKEN_PREFIX + token
        const tokenInput = { headers: { authorization: tokenHeader } }
        const revised = authorizTokenInputRevise(tokenInput)

        expect(typeof revised).toBe('object')
        expect(Object.keys(revised)).toEqual(
            expect.arrayContaining(['takenText', 'tokenMissing'])
        )
        expect(revised.tokenMissing).toBeFalsy()
        expect(revised.takenText).toEqual(token)
    })
    it('No real header test', ()=>{
        const tokenInput = { headers: '' }
        const revised = authorizTokenInputRevise(tokenInput)
        expect(typeof revised).toBe('object')
        expect(Object.keys(revised)).toEqual(
            expect.arrayContaining(['takenText', 'tokenMissing'])
        )
        expect(revised.tokenMissing).toBeTruthy()
        expect(revised.takenText).toBe(null)
    })
    it('No real authorization header test', ()=>{
        const tokenInput = { headers: { authorization: ''} }
        const revised = authorizTokenInputRevise(tokenInput)
        expect(typeof revised).toBe('object')
        expect(Object.keys(revised)).toEqual(
            expect.arrayContaining(['takenText', 'tokenMissing'])
        )
        expect(revised.tokenMissing).toBeTruthy()
        expect(revised.takenText).toBe(null)
    })
    it('No prefixed authorization header test', ()=>{
        const token = autorizTokenEncoder({ msg: 'text' })
        const tokenInput = { headers: { authorization: token } }
        const revised = authorizTokenInputRevise(tokenInput)
        expect(typeof revised).toBe('object')
        expect(Object.keys(revised)).toEqual(
            expect.arrayContaining(['takenText', 'tokenMissing'])
        )
        expect(revised.tokenMissing).toBeTruthy()
        expect(revised.takenText).toBe(null)
    })
    it('Damaged schema token test', ()=>{
        const tokenParts = autorizTokenEncoder({ msg: 'text' }).split('.')
        const token = tokenParts[0] + '.' + tokenParts[1] + tokenParts[2]
        const tokenInput = { headers: { authorization: token } }
        const revised = authorizTokenInputRevise(tokenInput)
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
        const token = jwt.sign(tokenContent, TOKEN_SECRET, { expiresIn: TOKEN_ACCESS_EXPIRE } )
        
        const result = await authorizTokenVerify( { tokenMissing: false, takenText: token})
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
        const token = jwt.sign(tokenContent, TOKEN_SECRET, { expiresIn: TOKEN_ACCESS_EXPIRE } )
        const badTokenParts = token.split('.')
        const badToken = badTokenParts[0] + '.' + badTokenParts[1] + badTokenParts[2]

        const result = await authorizTokenVerify({ tokenMissing: false, takenText: badToken})
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
        const token = jwt.sign(tokenContent, TOKEN_SECRET, { expiresIn: TOKEN_ACCESS_EXPIRE } )
        const tokenParts = token.split('.')

        const targetToAlter = tokenParts[1].slice(3, 6)
        tokenParts[1] = tokenParts[1].replace(targetToAlter, 'abcdefghijk')
        const badToken = tokenParts.join('.')
        const result = await authorizTokenVerify({ tokenMissing: false, takenText: badToken})
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

    it('Token missing, no login state', async ()=>{

        const result = await authorizTokenVerify({ tokenMissing: true, takenText: ''})
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

describe('Email tokenkey handle, processes', ()=>{
    it('Encode token with an id manually, then resolution test', ()=>{

        const actTime = new Date().getTime().toString().slice(0, 10)
        const theTimeSec = new Number(actTime)
        const token = jwt.sign({ marker: 'abcd' }, '123', { expiresIn: TOKEN_RESET_EXPIRE })
        const url = '12345.'+ token

        const res = resoluteTokenFromLink(url)
        expect(typeof res).toBe('object')
        expect(Object.keys(res)).toEqual(
            expect.arrayContaining(['tokenMissing', 'takenUserid', 'takenText'])
        )
        expect(typeof res.tokenMissing).toBe('boolean')
        expect(res.tokenMissing).toBeFalsy()
        expect(typeof res.takenUserid).toBe('string')
        expect(res.takenUserid).toBe('12345')
        expect(typeof res.takenText).toBe('string')

        jwt.verify(res.takenText, '123', (err, decoded)=>{
            expect(err).toBe(null)

            expect(typeof decoded).toBe('object')
            expect(Object.keys(decoded)).toEqual(
                expect.arrayContaining(['iat', 'exp', 'marker' ])
            )
            expect(decoded.marker).toBe('abcd')
            expect(decoded.exp).toEqual(theTimeSec + 3600)
        })
    })

    it('Encode and resolute normally, decode manually', async ()=>{
        const shortHash = 'stgtoimmitatehashtext'        
        const actTime = new Date().getTime().toString().slice(0, 10)
        const theTimeSec = new Number(actTime)
        const theSpecialToken = createTokenToLink('abcde', shortHash, '12345')
        console.log(theSpecialToken)
        const res = resoluteTokenFromLink(theSpecialToken)

        expect(typeof res.tokenMissing).toBe('boolean')
        expect(res.tokenMissing).toBeFalsy()
        expect(typeof res.takenUserid).toBe('string')
        expect(res.takenUserid).toBe('12345')
        expect(typeof res.takenText).toBe('string')

        jwt.verify(res.takenText, 'abcde'+shortHash, (err, decoded)=>{
            expect(err).toBe(null)

            expect(typeof decoded).toBe('object')
            expect(Object.keys(decoded)).toEqual(
                expect.arrayContaining(['iat', 'exp', 'marker' ])
            )
            expect(decoded.marker).toBe('abcde')
            expect(decoded.exp).toEqual(theTimeSec + 3600)
        })
    })

    it('Full encode and verify token', async ()=>{
        const shortHash = 'stgtoimmitatehashtext'
        const specToken = createTokenToLink('abcdef', shortHash, '123')
        
        const result = resoluteTokenFromLink(specToken)
        expect(typeof result).toBe('object')
        expect(result.tokenMissing).toBeFalsy()
        expect(result.takenUserid).toBe('123')
        expect(typeof result.takenText).toBe('string')
        console.log(result.takenText)
        const final = await verifyTokenFromLink(result, 'abcdef', shortHash)
        expect(Object.keys(final)).toEqual(
            expect.arrayContaining(['isExpired', 'error', 'passResetPermission'])
        )
        expect(typeof final.error).toBe('boolean')
        expect(final.error).toBeFalsy()
        expect(final.isExpired).toBeFalsy()
        expect(final.passResetPermission).toBeTruthy()
    })

    it('Faulty encoding, no userid', async ()=>{
        const shortHash = 'stgtoimmitatehashtext'        
        const specToken = createTokenToLink('abcdef', shortHash, '')

        const result = await resoluteTokenFromLink(specToken)
        expect(typeof result).toBe('object')

        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['tokenMissing', 'takenUserid', 'takenText'])
        )
        expect(result.tokenMissing).toBeTruthy()
    })
    it('Faulty resolution, removed middle', async ()=>{
        const shortHash = 'stgtoimmitatehashtext'
        const specToken = createTokenToLink('abcdef', shortHash, '123')
        const parts = specToken.split('.')
        const newUrl = parts[0] + '.' + parts[2] + '.' + parts[3] 

        const result = resoluteTokenFromLink(newUrl)
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['tokenMissing', 'takenUserid', 'takenText'])
        )
        expect(result.tokenMissing).toBeTruthy()
    })

    it('Faulty verify, removed passHash', async ()=>{
        const shortHash = 'stgtoimmitatehashtext'
        const specToken = createTokenToLink('abcdef', shortHash, '123')

        const result = resoluteTokenFromLink(specToken)
        expect(result.tokenMissing).toBeFalsy()
        expect(result.takenUserid).toBe('123')

        const final = await verifyTokenFromLink(result.takenText, result.takenUserid, '')
        expect(typeof final.error).toBe('object')

    })
})

describe('Refresh token creation tests', ()=>{
    it('Token revision test', ()=>{
        const token = jwt.sign({ id: '12345abcde' }, TOKEN_SECRET)

        const result = loginRefreshTokenInputRevise(token)
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['tokenMissing', 'takenText'])
        )
        expect(typeof result.tokenMissing).toBe('boolean')
        expect(result.tokenMissing).toBeFalsy()

        expect(typeof result.takenText).toBe('string')
        jwt.verify(result.takenText, TOKEN_SECRET, (err, decoded)=>{
            expect(err).toBe(null)
            expect(typeof decoded).toBe('object')
            expect(decoded.exp).toBe(undefined)
            expect(decoded.id).toBe('12345abcde')
        })
    })
    it('Token encoding, revision', ()=>{
        const token = createRefreshToken({ id: '12345abcde' })
        const result = loginRefreshTokenInputRevise(token)
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['tokenMissing', 'takenText'])
        )
        expect(typeof result.tokenMissing).toBe('boolean')
        expect(result.tokenMissing).toBeFalsy()

        expect(typeof result.takenText).toBe('string')
        jwt.verify(result.takenText, TOKEN_SECRET, (err, decoded)=>{
            expect(err).toBe(null)
            expect(typeof decoded).toBe('object')
            expect(decoded.exp).toBe(undefined)
            expect(decoded.id).toBe('12345abcde')
        })
    })
    it('Token full process', async ()=>{
        const token = createRefreshToken({ id: '12345abcde' })
        const result = loginRefreshTokenInputRevise(token)
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['tokenMissing', 'takenText'])
        )
        expect(typeof result.tokenMissing).toBe('boolean')
        expect(result.tokenMissing).toBeFalsy()

        expect(typeof result.takenText).toBe('string')
        const final = await loginRefreshTokenValidate(result)

        expect(typeof final).toBe('object')
        console.log(final)
        expect(Object.keys(final)).toEqual(
            expect.arrayContaining(['error','refreshingPermission', 'id', 'iat'])
        )
        expect(typeof final.error).toBe('boolean')
        expect(final.error).toBeFalsy()
        expect(typeof final.refreshingPermission).toBe('boolean')
        expect( final.refreshingPermission).toBeTruthy()
        expect(typeof final.id).toBe('string')
        expect(final.id).toBe('12345abcde')
    })

    it('Refresh token schema fail', ()=>{
        const token = createRefreshToken({ id: '12345abcde' })
        const parts = token.split('.')
        const faulty = parts[0] + '.' + parts[2] 

        const result = loginRefreshTokenInputRevise(faulty)
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['tokenMissing', 'takenText'])
        )
        expect(typeof result.tokenMissing).toBe('boolean')
        expect(result.tokenMissing).toBeTruthy()
    })
    it('At verification no input', async ()=>{

        const final = await loginRefreshTokenValidate('')
        expect(typeof final).toBe('object')
        expect(Object.keys(final)).toEqual(
            expect.arrayContaining([ 'error', 'refreshingPermission' ])
        )
        expect(typeof final.error).toBe('object')
    })
})