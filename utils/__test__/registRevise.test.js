const { registerInputRevise } = require('../inputRevise')

describe('Registration tests', ()=>{
    const inputs = [
        { email: 'user@gmail.com', password: 'test123Test', passwordconf: 'test123Test', username: 'Some Thing' },
        { email: 'user@gmail.com', password: 'test123Test', passwordconf: 'test123', username: 'Some Thing' },
    /* 2 */  { email: 'u@gmail.com', password: 'test123Test', passwordconf: 'test123Test', username: 'Some Thing' },
        { email: 'user@gmail.com', password: 'test', passwordconf: 'test123Test', username: 'Some Thing' },
        { email: 'user@gmail.com', password: 'test123Test', passwordconf: 'test123Test', username: 'me' },
    /* 5 */ { email: 'user@gmail.com', password: 'test123Test', passwordconf: 'test123Test', username: 'meHere to have a good social medai account for my social life' },
        { email: '', password: '', passwordconf: '', username: '' }
    ]
    it('Correct reg input', ()=>{
        const actInput = inputs[0]
        const { error, field, issue, email, pwdText } = registerInputRevise(
            actInput.email,
            actInput.password,
            actInput.passwordconf,
            actInput.username )
        
        expect(email).toBe(actInput.email)
        expect(pwdText).toBe(actInput.password)
        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)
    })
    it('No proper conformation', ()=>{
        const actInput = inputs[1]
        const { error, field, issue, email, pwdText } = registerInputRevise(
            actInput.email,
            actInput.password,
            actInput.passwordconf,
            actInput.username  )
        
        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(1)
        expect(field[0]).toBe('passwordconf')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(1)
        expect(issue[0]).toBe('This password conformation is not proper!')

        expect(email).toBe(undefined)
        expect(pwdText).toBe(undefined)
    })
    it('No proper email', ()=>{
        const actInput = inputs[2]
        const { error, field, issue, email, pwdText } = registerInputRevise(
            actInput.email,
            actInput.password,
            actInput.passwordconf,
            actInput.username  )
        
        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(1)
        expect(field[0]).toBe('email')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(1)
        expect(issue[0]).toBe('This email is not acceptable!')

        expect(email).toBe(undefined)
        expect(pwdText).toBe(undefined)
    })
    it('No proper password', ()=>{
        const actInput = inputs[3]
        const { error, field, issue, email, pwdText } = registerInputRevise(
            actInput.email,
            actInput.password,
            actInput.passwordconf,
            actInput.username  )
        
        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(2)
        expect(field[0]).toBe('password')
        expect(field[1]).toBe('passwordconf')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(2)
        expect(issue[0]).toBe('This password is not acceptable!')
        expect(issue[1]).toBe('This password conformation is not proper!')

        expect(email).toBe(undefined)
        expect(pwdText).toBe(undefined)
    })
    it('Not acceptable username, too short', ()=>{
        const actInput = inputs[4]
        const { error, field, issue, email, pwdText } = registerInputRevise(
            actInput.email,
            actInput.password,
            actInput.passwordconf,
            actInput.username  )
        
        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(1)
        expect(field[0]).toBe('username')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(1)
        expect(issue[0]).toBe('This username is not acceptable!')

        expect(email).toBe(undefined)
        expect(pwdText).toBe(undefined)
    })
    it('Not acceptable username, too long', ()=>{
        const actInput = inputs[5]
        const { error, field, issue, email, pwdText } = registerInputRevise(
            actInput.email,
            actInput.password,
            actInput.passwordconf,
            actInput.username  )
        
        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(1)
        expect(field[0]).toBe('username')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(1)
        expect(issue[0]).toBe('This username is not acceptable!')

        expect(email).toBe(undefined)
        expect(pwdText).toBe(undefined)
    })
    it('Empty fields', ()=>{
        const actInput = inputs[6]
        const { error, field, issue, email, pwdText } = registerInputRevise(
            actInput.email,
            actInput.password,
            actInput.passwordconf,
            actInput.username  )
        
        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(3)
        expect(field[0]).toBe('email')
        expect(field[1]).toBe('password')
        expect(field[2]).toBe('username')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(3)
        expect(issue[0]).toBe('This email is not acceptable!')
        expect(issue[1]).toBe('This password is not acceptable!')
        expect(issue[2]).toBe('This username is not acceptable!')

        expect(email).toBe(undefined)
        expect(pwdText).toBe(undefined)
    })
})