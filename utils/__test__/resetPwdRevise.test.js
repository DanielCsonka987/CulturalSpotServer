const { resetPwdInputRevise } = require('../inputRevise')

describe('Password reset email revision tests', ()=>{
    const inputs = [
        'sombody@gmail.com', 'me1990@hotmail.com',
        'sm@gmail.com', 'smbhotmail.com',
        'sombody@m.uk', 'sombody@hotmailcom'
    ]

    let counter = 0;
    
    afterEach(()=>{
        counter++;
    })

    it('Normal email input 1', ()=>{
        const actValue = inputs[counter]
        const { error, field, issue, email} = 
            resetPwdInputRevise(actValue)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(email).toBe(actValue)
    })
    it('Normal email input 2', ()=>{
        const actValue = inputs[counter]
        const { error, field, issue, email} = 
            resetPwdInputRevise(actValue)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(email).toBe(actValue)
    })
    it('Bad email input 1', ()=>{
        const actValue = inputs[counter]
        const { error, field, issue, email} = 
            resetPwdInputRevise(actValue)

        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(1)
        expect(field[0]).toBe('email')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(1)
        expect(issue[0]).toBe('This email is not acceptable!')

        expect(email).toBe(undefined)
    })
    it('Bad email input 2', ()=>{
        const actValue = inputs[counter]
        const { error, field, issue, email} = 
            resetPwdInputRevise(actValue)

        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(1)
        expect(field[0]).toBe('email')

        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(1)
        expect(issue[0]).toBe('This email is not acceptable!')

        expect(email).toBe(undefined)
    })
    it('Bad email input 3', ()=>{
        const actValue = inputs[counter]
        const { error, field, issue, email} = 
            resetPwdInputRevise(actValue)

        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(1)
        expect(field[0]).toBe('email')

        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(1)
        expect(issue[0]).toBe('This email is not acceptable!')

        expect(email).toBe(undefined)
    })
    it('Bad email input 4', ()=>{
        const actValue = inputs[counter]
        const { error, field, issue, email} = 
            resetPwdInputRevise(actValue)

        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(1)
        expect(field[0]).toBe('email')

        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(1)
        expect(issue[0]).toBe('This email is not acceptable!')

        expect(email).toBe(undefined)
    })
})