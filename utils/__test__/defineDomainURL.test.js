const definer = require('../defineDomainURL')

describe('App domain definer tests', ()=>{
    const HOST_URL_OBJ = { apolloUrl: '' }

    it('Simple test, still not defined url', ()=>{
        const res = definer(
            { protocol: 'https://', get: ()=>{return 'example.com/'} }, 
            HOST_URL_OBJ
        )

        expect(HOST_URL_OBJ).toEqual({ 
            prot: 'https://', 
            coupler: '://',
            dom: 'example.com/',
            apolloUrl: 'https://example.com/'
        })
        expect( Object.isFrozen(HOST_URL_OBJ)).toBeTruthy()
    })
    it('Simple test, already defined url', ()=>{
        const res = definer(
            { protocol: 'http://', get: ()=>{ return 'another.uk' } },
            HOST_URL_OBJ
        )
        expect(HOST_URL_OBJ).toEqual({ 
            prot: 'https://', 
            coupler: '://',
            dom: 'example.com/',
            apolloUrl: 'https://example.com/'
        })
    })
})