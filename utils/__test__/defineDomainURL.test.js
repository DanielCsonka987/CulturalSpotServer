const definer = require('../defineDomainURL')

describe('App domain definer tests', ()=>{
    const HOST_URL_OBJ = { url: '' }
    it('Simple test, still not defined url', ()=>{
        const res = definer(
            { protocol: 'https://', get: ()=>{return 'example.com/'} }, 
            HOST_URL_OBJ
        )

        expect(HOST_URL_OBJ.url).toEqual({ prot: 'https://', dom: 'example.com/' })
        expect( Object.isFrozen(HOST_URL_OBJ)).toBeTruthy()
    })
    it('ŰSimple test, already defined url', ()=>{
        const res = definer(
            { protocol: 'http://', get: ()=>{ return 'another.uk' } },
            HOST_URL_OBJ
        )
        expect(HOST_URL_OBJ.url).toEqual({ prot: 'https://', dom: 'example.com/' })
    })
})