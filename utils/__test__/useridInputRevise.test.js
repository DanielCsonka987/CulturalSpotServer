const { useridInputRevise } = require('../inputRevise')

describe('Correct userid input, related MongoDB _id-s', ()=>{
    const inputs = [ 
        '0123456789abcdef01234567',

        '9876543210tzffac98765432',
        '0123456789abcdef0123456789',
        '0123456789abcdef',
        ''
    ]
    it('Correct input', ()=>{
        const actInput = inputs[0]
        const { error, issue, field, userid } = useridInputRevise(actInput)

        expect(typeof error).toBe('undefined')
        expect(typeof issue).toBe('undefined')
        expect(typeof field).toBe('undefined')

        expect(userid).toBe(actInput)
    })

    it('Incorrect input 1', ()=>{
        const actInput = inputs[1]
        const { error, issue, field, userid } = useridInputRevise(actInput)
        
        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof issue).toBe('object')
        expect(Object.keys(issue)).toHaveLength(1)
        expect(issue[0]).toBe('The userid is not acceptable!')
        expect(typeof field).toBe('object')
        expect(Object.keys(field)).toHaveLength(1)
        expect(field[0]).toBe('userid')

        expect(userid).toBe(undefined)
    })
    it('Incorrect input 2', ()=>{
        const actInput = inputs[2]
        const { error, issue, field, userid } = useridInputRevise(actInput)
        
        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof issue).toBe('object')
        expect(Object.keys(issue)).toHaveLength(1)
        expect(issue[0]).toBe('The userid is not acceptable!')
        expect(typeof field).toBe('object')
        expect(Object.keys(field)).toHaveLength(1)
        expect(field[0]).toBe('userid')

        expect(userid).toBe(undefined)
    })
    it('Incorrect input 3', ()=>{
        const actInput = inputs[3]
        const { error, issue, field, userid } = useridInputRevise(actInput)
        
        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof issue).toBe('object')
        expect(Object.keys(issue)).toHaveLength(1)
        expect(issue[0]).toBe('The userid is not acceptable!')
        expect(typeof field).toBe('object')
        expect(Object.keys(field)).toHaveLength(1)
        expect(field[0]).toBe('userid')

        expect(userid).toBe(undefined)
    })
    it('Incorrect input 4', ()=>{
        const actInput = inputs[4]
        const { error, issue, field, userid } = useridInputRevise(actInput)
        
        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof issue).toBe('object')
        expect(Object.keys(issue)).toHaveLength(1)
        expect(issue[0]).toBe('The userid is not acceptable!')
        expect(typeof field).toBe('object')
        expect(Object.keys(field)).toHaveLength(1)
        expect(field[0]).toBe('userid')

        expect(userid).toBe(undefined)
    })
})