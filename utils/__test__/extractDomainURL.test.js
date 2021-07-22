const extractor = require('../extractDomainURL')

describe('URL managment with good inpupt', ()=>{
    const inputs = [
        'https://google.com/', 
        'https://amazon.co.uk/',
        'https://facebook.com',
        'http://examplesite.jp/some/path',
        'http://awebsite.com/index.php',
        'https://ablogsite.it/profile/000111/',
        'https://strictporting.uk:8080'
    ]
    const mustResults = [
        'https://google.com/',
        'https://amazon.co.uk/',
        'https://facebook.com/',
        'http://examplesite.jp/',
        'http://awebsite.com/',
        'https://ablogsite.it/',
        'https://strictporting.uk:8080/'
    ]
    let counter = 0
    afterEach(()=>{
        counter++;
    })
    it('Good, but different URL ' + inputs[0], ()=>{
        const result = extractor(inputs[counter])
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['success', 'url'])
        )
        expect(result.success).toBeTruthy()
        expect(result.url).toBe(mustResults[counter])
    })
    it('Good, but different URL ' + inputs[1], ()=>{
        const result = extractor(inputs[counter])
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['success', 'url'])
        )
        expect(result.success).toBeTruthy()
        expect(result.url).toBe(mustResults[counter])
    })
    it('Good, but different URL ' + + inputs[2], ()=>{
        const result = extractor(inputs[counter])
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['success', 'url'])
        )
        expect(result.success).toBeTruthy()
        expect(result.url).toBe(mustResults[counter])
    })
    it('Good, but different URL ' + + inputs[3], ()=>{
        const result = extractor(inputs[counter])
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['success', 'url'])
        )
        expect(result.success).toBeTruthy()
        expect(result.url).toBe(mustResults[counter])
    })
    it('Good, but different URL ' + + inputs[4], ()=>{
        const result = extractor(inputs[counter])
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['success', 'url'])
        )
        expect(result.success).toBeTruthy()
        expect(result.url).toBe(mustResults[counter])
    })
    it('Good, but different URL ' + + inputs[5], ()=>{
        const result = extractor(inputs[counter])
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['success', 'url'])
        )
        expect(result.success).toBeTruthy()
        expect(result.url).toBe(mustResults[counter])
    })
    it('Good, but different URL ' + inputs[6], ()=>{
        const result = extractor(inputs[counter])
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['success', 'url'])
        )
        expect(result.success).toBeTruthy()
        expect(result.url).toBe(mustResults[counter])
    })
})

describe('URL management with incorrect inputs', ()=>{
    const inputs = [
        'nohttpaddress@gmail.com',
        'fragment/rather/path',
        'fragment.uk/url',
        'sw://rahterwebsocket.com',
        'someText',
        '',
    ]
    let counter = 0;
    afterEach(()=>{
        counter++;
    })

    it('Incorrect url ' + inputs[0], ()=>{
        const result = extractor(inputs[counter])
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['success', 'url'])
        )
        expect(result.success).toBeFalsy()
        expect(result.url).toBe('')
    })
    it('Incorrect url ' + inputs[1], ()=>{
        const result = extractor(inputs[counter])
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['success', 'url'])
        )
        expect(result.success).toBeFalsy()
        expect(result.url).toBe('')
    })
    it('Incorrect url ' + inputs[2], ()=>{
        const result = extractor(inputs[counter])
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['success', 'url'])
        )
        expect(result.success).toBeFalsy()
        expect(result.url).toBe('')
    })
    it('Incorrect url ' + inputs[3], ()=>{
        const result = extractor(inputs[counter])
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['success', 'url'])
        )
        expect(result.success).toBeFalsy()
        expect(result.url).toBe('')
    })
    it('Incorrect url ' + inputs[4], ()=>{
        const result = extractor(inputs[counter])
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['success', 'url'])
        )
        expect(result.success).toBeFalsy()
        expect(result.url).toBe('')
    })
    it('Incorrect url ' + inputs[5], ()=>{
        const result = extractor(inputs[counter])
        expect(typeof result).toBe('object')
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['success', 'url'])
        )
        expect(result.success).toBeFalsy()
        expect(result.url).toBe('')
    })
})