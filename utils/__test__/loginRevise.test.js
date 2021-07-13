const { loginInputRevise } = require('../inputRevise')

describe('Revision testing, login', ()=>{
    const inputs = [
    /* 0 */ { email: 'user@gmail.com', password: 'pwd123Test' },
        { email: ' user@gmail.com  ', password: 'pwd123Test' },
        { email: 'user.name@gmail.com', password: 'pwd123Test' },
    /* 3 */ { email: 'user.1name@gmail.com', password: 'pwd123Test' },
        { email: 'user_name@gmail.com', password: 'pwd123Test' },
        { email: 'usergmail.com', password: 'pwd123Test' },
    /* 6 */ { email: '@gmail.com', password: 'pwd123Test' },
        { email: 'user@.com', password: 'pwd123Test' },
        { email: 'user@gmail.', password: 'pwd123Test' },
    /* 9 */{ email: 'user@gmailcom', password: 'pwd123Test' }, //problem the '.'
        { email: 'user.here@gmailcom', password: 'pwd123Test' },//problem the '.'
        { email: 'us@gmail.com', password: 'pwd123Test'},
    /* 12 */{ email: 'user@g.com', password: 'pwd123Test'},
        { email: 'user@gmail.c', password: 'pwd123Test'},
        { email: '', password: 'pwd123Test' },
    /* 15 */{ email: 'user@gmail.com', password: '' },
        { email: '', password: ''},
        { email: 'user@gmail.uk', password: 'pwd123Test'}

    ]

    it('Login 1 - correct, user@gmail.com', ()=>{
        const actValues = inputs[0]
        const { error, field, issue, email, pwdText } 
            = loginInputRevise(actValues.email, actValues.password)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(email).toBe(actValues.email)
        expect(pwdText).toBe(actValues.password)
    })
    it('Login 2 - correct, user@gmail.com with some padding', ()=>{
        const actValues = inputs[1]
        const { error, field, issue, email, pwdText } 
            = loginInputRevise(actValues.email, actValues.password)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(email).toBe(actValues.email.trim())
        expect(pwdText).toBe(actValues.password)
    })
    it('Login 3 - correct, user.name@gmail.com', ()=>{
        const actValues = inputs[2]
        const { error, field, issue, email, pwdText } 
            = loginInputRevise(actValues.email, actValues.password)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(email).toBe(actValues.email)
        expect(pwdText).toBe(actValues.password)
    })
    it('Login 4 - correct, user.1name@gmail.com', ()=>{
        const actValues = inputs[3]
        const { error, field, issue, email, pwdText } 
            = loginInputRevise(actValues.email, actValues.password)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(email).toBe(actValues.email)
        expect(pwdText).toBe(actValues.password)
    })
    it('Login 5 - correct, user_name@gmail.com', ()=>{
        const actValues = inputs[4]
        const { error, field, issue, email, pwdText } 
            = loginInputRevise(actValues.email, actValues.password)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(email).toBe(actValues.email)
        expect(pwdText).toBe(actValues.password)
    })
    it('Login 6 - email issue, usergmail.com', ()=>{
        const actValues = inputs[5]
        const { error, field, issue, email, pwdText } 
            = loginInputRevise(actValues.email, actValues.password)

        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field[0]).toBe('email')
        expect(field[1]).toBe(undefined)
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue[0]).toBe('This email is not acceptable!')
        expect(issue[1]).toBe(undefined)

        expect(email).toBe(undefined)
        expect(pwdText).toBe(undefined)
    })
    it('Login 7 - email issue, @gmail.com', ()=>{
        const actValues = inputs[6]
        const { error, field, issue, email, pwdText } 
            = loginInputRevise(actValues.email, actValues.password)

            expect(error).toBeTruthy()
            expect(Array.isArray(field)).toBeTruthy()
            expect(field[0]).toBe('email')
            expect(field[1]).toBe(undefined)
            expect(Array.isArray(issue)).toBeTruthy()
            expect(issue[0]).toBe('This email is not acceptable!')
            expect(issue[1]).toBe(undefined)
    
            expect(email).toBe(undefined)
            expect(pwdText).toBe(undefined)

    })
    it('Login 8 - email issue, user@.com', ()=>{
        const actValues = inputs[7]
        const { error, field, issue, email, pwdText } 
            = loginInputRevise(actValues.email, actValues.password)

        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field[0]).toBe('email')
        expect(field[1]).toBe(undefined)
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue[0]).toBe('This email is not acceptable!')
        expect(issue[1]).toBe(undefined)

        expect(email).toBe(undefined)
        expect(pwdText).toBe(undefined)

    })
    it('Login 9 - email issue, user@gmail', ()=>{
        const actValues = inputs[8]
        const { error, field, issue, email, pwdText } 
            = loginInputRevise(actValues.email, actValues.password)

        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field[0]).toBe('email')
        expect(field[1]).toBe(undefined)
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue[0]).toBe('This email is not acceptable!')
        expect(issue[1]).toBe(undefined)

        expect(email).toBe(undefined)
        expect(pwdText).toBe(undefined)
    })
    it('Login 10 - email issue, user@gmailcom', ()=>{
        const actValues = inputs[9]
        const { error, field, issue, email, pwdText } 
            = loginInputRevise(actValues.email, actValues.password)

        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field[0]).toBe('email')
        expect(field[1]).toBe(undefined)
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue[0]).toBe('This email is not acceptable!')
        expect(issue[1]).toBe(undefined)

        expect(email).toBe(undefined)
        expect(pwdText).toBe(undefined)
    })
    it('Login 11 - email issue, user.here@gmailcom', ()=>{
        const actValues = inputs[10]
        const { error, field, issue, email, pwdText } 
            = loginInputRevise(actValues.email, actValues.password)

        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field[0]).toBe('email')
        expect(field[1]).toBe(undefined)
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue[0]).toBe('This email is not acceptable!')
        expect(issue[1]).toBe(undefined)

        expect(email).toBe(undefined)
        expect(pwdText).toBe(undefined)
    })
    it('Login 12 - email issue, us@gmail.com', ()=>{
        const actValues = inputs[11]
        const { error, field, issue, email, pwdText } 
            = loginInputRevise(actValues.email, actValues.password)

        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field[0]).toBe('email')
        expect(field[1]).toBe(undefined)
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue[0]).toBe('This email is not acceptable!')
        expect(issue[1]).toBe(undefined)

        expect(email).toBe(undefined)
        expect(pwdText).toBe(undefined)
    })
    it('Login 13 - email issue, user@g.com', ()=>{
        const actValues = inputs[12]
        const { error, field, issue, email, pwdText } 
            = loginInputRevise(actValues.email, actValues.password)

        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field[0]).toBe('email')
        expect(field[1]).toBe(undefined)
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue[0]).toBe('This email is not acceptable!')
        expect(issue[1]).toBe(undefined)

        expect(email).toBe(undefined)
        expect(pwdText).toBe(undefined)
    })
    it('Login 14 - email issue, user@gmail.c', ()=>{
        const actValues = inputs[13]
        const { error, field, issue, email, pwdText } 
            = loginInputRevise(actValues.email, actValues.password)

        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field[0]).toBe('email')
        expect(field[1]).toBe(undefined)
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue[0]).toBe('This email is not acceptable!')
        expect(issue[1]).toBe(undefined)

        expect(email).toBe(undefined)
        expect(pwdText).toBe(undefined)
    })
    it('Login 15 - email issue, none', ()=>{
        const actValues = inputs[14]
        const { error, field, issue, email, pwdText } 
            = loginInputRevise(actValues.email, actValues.password)

        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field[0]).toBe('email')
        expect(field[1]).toBe(undefined)
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue[0]).toBe('This email is not acceptable!')
        expect(issue[1]).toBe(undefined)

        expect(email).toBe(undefined)
        expect(pwdText).toBe(undefined)
    })
    it('Login 16 - password issue, none', ()=>{
        const actValues = inputs[15]
        const { error, field, issue, email, pwdText } 
            = loginInputRevise(actValues.email, actValues.password)

        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field[0]).toBe('password')
        expect(field[1]).toBe(undefined)
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue[0]).toBe('This password is not acceptable!')
        expect(issue[1]).toBe(undefined)

        expect(email).toBe(undefined)
        expect(pwdText).toBe(undefined)
    })
    it('Login 17 - email and password issue, none', ()=>{
        const actValues = inputs[16]
        const { error, field, issue, email, pwdText } 
            = loginInputRevise(actValues.email, actValues.password)

        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field[0]).toBe('email')
        expect(field[1]).toBe('password')
        expect(field[2]).toBe(undefined)
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue[0]).toBe('This email is not acceptable!')
        expect(issue[1]).toBe('This password is not acceptable!')
        expect(issue[2]).toBe(undefined)

        expect(email).toBe(undefined)
        expect(pwdText).toBe(undefined)
    })
    it('Login 18 - correct, user@gmail.uk', ()=>{
        const actValues = inputs[17]
        const { error, field, issue, email, pwdText } 
            = loginInputRevise(actValues.email, actValues.password)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(email).toBe(actValues.email)
        expect(pwdText).toBe(actValues.password)
    })
})