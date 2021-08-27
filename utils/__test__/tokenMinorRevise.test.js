const jwt = require('jsonwebtoken')
const { TOKEN_SECRET, TOKEN_ACCESS_EXPIRE } = require('../../config/appConfig')

const { authorizationHeaderExist, refreshingHeaderExist, 
    isolateBearerFromHeader, isolateTokenFromURL, 
    tokenNormalSchemasFaulty, tokenSpecRevAndSplitting } = require('../inputRevise')

describe('Token revison-components tests', ()=>{
    const goodToken = jwt.sign(
        { subj: '0123456789abcdef01234567', email: 'email@example.uk'}, 
        TOKEN_SECRET, { expiresIn: TOKEN_ACCESS_EXPIRE } 
    )

    it('WebSocket Tokne form URL inputs', ()=>{
        //proper inputs
        expect( isolateTokenFromURL('/' + goodToken) ).toBe(goodToken)
        expect( isolateTokenFromURL('/' + goodToken + '/') ).toBe(goodToken)
        expect( isolateTokenFromURL('/' + goodToken + '/stg') ).toBe(goodToken)

        //unproper inputs
        expect( isolateTokenFromURL('/') ).toBeFalsy()
        expect( isolateTokenFromURL(null) ).toBeFalsy()
    })

    it('Authorization and refreshing header existance tests', ()=>{
        expect( authorizationHeaderExist({headers: { authorization: 'stg' }}) ).toBeTruthy()
        expect( refreshingHeaderExist({headers: { refreshing: 'stg' }})  ).toBeTruthy()

        expect( authorizationHeaderExist({ headers: { authorization: '' } }) ).toBeFalsy()
        expect( authorizationHeaderExist({ headers: {} }) ).toBeFalsy()
        expect( authorizationHeaderExist({ headers: null }) ).toBeFalsy()
        expect( authorizationHeaderExist({ }) ).toBeFalsy()
        expect( authorizationHeaderExist(null) ).toBeFalsy()

        expect( refreshingHeaderExist({ headers: { refreshing: '' } }) ).toBeFalsy()
        expect( refreshingHeaderExist({ headers: {  } }) ).toBeFalsy()
        expect( refreshingHeaderExist({ headers: null }) ).toBeFalsy()
        expect( refreshingHeaderExist({ }) ).toBeFalsy()
        expect( refreshingHeaderExist(null) ).toBeFalsy()
    })

    it('Authorization header "Bearer " removals test', ()=>{
        expect(isolateBearerFromHeader(`Bearer ${goodToken}`)).toBe(goodToken)
        expect(isolateBearerFromHeader(`Bearer stgelse`)).not.toBe(goodToken)

        expect(isolateBearerFromHeader(`Bear ${goodToken}`)).toBeFalsy()
        expect(isolateBearerFromHeader(`bearer ${goodToken}`)).toBeFalsy()
        expect(isolateBearerFromHeader(`${goodToken}`)).toBeFalsy()
        expect(isolateBearerFromHeader(`Bearer `)).toBeFalsy()
        expect(isolateBearerFromHeader(``)).toBeFalsy()
        expect(isolateBearerFromHeader(null)).toBeFalsy()
    })

    it('Normal token schema revison tests', ()=>{
        const tokenParts = goodToken.split('.')

        expect(tokenNormalSchemasFaulty(goodToken)).toBeFalsy()

        const faulty1 = tokenParts[0] + '.' +  tokenParts[1] + tokenParts[2]
        const faulty2 = tokenParts[0] + '.' +  tokenParts[1] + '.' 
            + tokenParts[2] + '.' + tokenParts[2]
        const faulty3 = tokenParts[0]

        expect( tokenNormalSchemasFaulty(faulty1) ).toBeTruthy()
        expect( tokenNormalSchemasFaulty(faulty2) ).toBeTruthy()
        expect( tokenNormalSchemasFaulty(faulty3) ).toBeTruthy()
        expect( tokenNormalSchemasFaulty('') ).toBeTruthy()
    })

    it('Special token shcmea revision tests', ()=>{
        const specToken = '0123456789abcdef01234567.' + goodToken
        const res1 = tokenSpecRevAndSplitting(specToken)
        expect(res1).toHaveLength(4)
        expect(res1[0]).toBe('0123456789abcdef01234567')
        expect(res1[1] + '.' + res1[2] + '.' + res1[3]).toBe(goodToken)

        const specTokenBad1 = '0123456789abcdef01234567' + goodToken
        expect( tokenSpecRevAndSplitting(goodToken) ).toBeFalsy()
        expect( tokenSpecRevAndSplitting(specTokenBad1) ).toBeFalsy()
        expect( tokenSpecRevAndSplitting('') ).toBeFalsy()
    })

})
