const jwt = require('jsonwebtoken')

const { tokenEncoder, tokenInputRevise, tokenVerify } 
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
            expect(diff).toEqual(3600)
        })
        
    })
})
describe('Token input revision tests', ()=>{
    it('Normal test', ()=>{
        const token = tokenEncoder({ msg: 'text' })
        const tokenHeader = TOKEN_PREFIX + token
        const tokenInput = { headers: { authorazition: tokenHeader } }
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
    it('No real authorazition header test', ()=>{
        const tokenInput = { headers: { authorazition: ''} }
        const revised = tokenInputRevise(tokenInput)
        expect(typeof revised).toBe('object')
        expect(Object.keys(revised)).toEqual(
            expect.arrayContaining(['takenText', 'tokenMissing'])
        )
        expect(revised.tokenMissing).toBeTruthy()
        expect(revised.takenText).toBe(null)
    })
    it('No prefixed authorazition header test', ()=>{
        const token = tokenEncoder({ msg: 'text' })
        const tokenInput = { headers: { authorazition: token } }
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
        const tokenInput = { headers: { authorazition: token } }
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
        
        const result = await tokenVerify(token)
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining([ 'userid', 'email', 'expired', 'error' ])
        )
        expect(typeof result.error).toBe('boolean')
        expect(result.error).toBeFalsy()
        expect(typeof result.expired).toBe('boolean')
        expect(result.expired).toBeFalsy()

        expect(result.userid).toBe('001')
        expect(result.email).toBe('stg@testing.uk')
    })

    it('Token damaged schema', async ()=>{
        const tokenContent = { id: '001', email: 'stg@testing.uk' }
        const token = jwt.sign(tokenContent, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRE } )
        const badTokenParts = token.split('.')
        const badToken = badTokenParts[0] + '.' + badTokenParts[1] + badTokenParts[2]

        const result = await tokenVerify(badToken)
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining([ 'userid', 'email', 'expired', 'error' ])
        )

        expect(typeof result.error).toBe('object')
        expect(result.error.name).toBe('JsonWebTokenError')
        expect(result.error.message).toBe('jwt malformed')

        expect(result.expired).toBeFalsy()
        expect(result.userid).toBe('')
        expect(result.email).toBe('')
    })

    it('Token direct modified', async ()=>{
        const tokenContent = { id: '001', email: 'stg@testing.uk' }
        const token = jwt.sign(tokenContent, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRE } )
        const tokenParts = token.split('.')

        const targetToAlter = tokenParts[1].slice(3, 6)
        tokenParts[1] = tokenParts[1].replace(targetToAlter, 'abcdefghijk')
        const badToken = tokenParts.join('.')
        const result = await tokenVerify(badToken)
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining([ 'userid', 'email', 'expired', 'error' ])
        )
        expect(typeof result.error).toBe('object')
        expect(result.expired).toBeFalsy()
        expect(result.userid).toBe('')
        expect(result.email).toBe('')
    })
})
