const { updateAccDetInputRevise } = require('../inputRevise')

describe('Account data update input revision tests', ()=>{
    const inputs = [
        'A username', '', 'unm', '$$$$$',
    ]
    let counter = 0;

    afterEach(()=>{
        counter++;
    })

    it('Good username input', ()=>{
        const act = inputs[counter]
        const {error, field, issue, username} 
            = updateAccDetInputRevise(act)


        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(username).toBe(act)
    })

    it('Bad username input 1', ()=>{
        const act = inputs[counter]
        const {error, field, issue, username} 
            = updateAccDetInputRevise(act)

        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(1)
        expect(field[0]).toBe('username')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(1)
        expect(issue[0]).toBe('This username is not acceptable!')

        expect(username).toBe(undefined)
    })
    it('Bad username input 2', ()=>{
        const act = inputs[counter]
        const {error, field, issue, username} 
            = updateAccDetInputRevise(act)

        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(1)
        expect(field[0]).toBe('username')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(1)
        expect(issue[0]).toBe('This username is not acceptable!')

        expect(username).toBe(undefined)
    })
    it('Bad username input 3', ()=>{
        const act = inputs[counter]
        const {error, field, issue, username} 
            = updateAccDetInputRevise(act)

        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(1)
        expect(field[0]).toBe('username')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(1)
        expect(issue[0]).toBe('This username is not acceptable!')

        expect(username).toBe(undefined)
    })
})
