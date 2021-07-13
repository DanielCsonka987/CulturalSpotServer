const { deleteAccInputRevise } = require('../inputRevise')

describe('Account deletion input revision tests', ()=>{
    const inputs = [
        { password: 'somePassword', passwordconf: 'somePassword' },
        { password: 'som', passwordconf: 'somePassword' },
        { password: '', passwordconf: 'somePassword' },
        { password: 'somePassword', passwordconf: 'some' },
        { password: 'somePassword', passwordconf: '' },
        { password: '', passwordconf: '' }
    ]

    let counter = 0;
    afterEach(()=>{
        counter++;
    })

    it('Correct inputs', ()=>{
        const actInput = inputs[counter]
        const { error, field, issue, pwdTextOld } = deleteAccInputRevise(
            actInput.password, actInput.passwordconf
        )
        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(pwdTextOld).toBe(actInput.password)
        expect(pwdTextOld).toBe(actInput.passwordconf)
    })
    it('Bad inputs 1, uncorrect password', ()=>{
        const actInput = inputs[counter]
        const { error, field, issue, pwdTextOld } = deleteAccInputRevise(
            actInput.password, actInput.passwordconf
        )

        expect(typeof error).toBe('boolean')
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(2)
        expect(field[0]).toBe('password')
        expect(field[1]).toBe('passwordconf')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(2)
        expect(issue[0]).toBe('The password is not acceptable!')
        expect(issue[1]).toBe('The password conformation is not proper!')

        expect(pwdTextOld).toBe(undefined)
    })
    it('Bad inputs 2, no password', ()=>{
        const actInput = inputs[counter]
        const { error, field, issue, pwdTextOld } = deleteAccInputRevise(
            actInput.password, actInput.passwordconf
        )

        expect(typeof error).toBe('boolean')
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(2)
        expect(field[0]).toBe('password')
        expect(field[1]).toBe('passwordconf')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(2)
        expect(issue[0]).toBe('The password is not acceptable!')
        expect(issue[1]).toBe('The password conformation is not proper!')

        expect(pwdTextOld).toBe(undefined)
    })
    it('Bad inputs 3, uncorrect conformation', ()=>{
        const actInput = inputs[counter]
        const { error, field, issue, pwdTextOld } = deleteAccInputRevise(
            actInput.password, actInput.passwordconf
        )

        expect(typeof error).toBe('boolean')
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(1)
        expect(field[0]).toBe('passwordconf')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(1)
        expect(issue[0]).toBe('The password conformation is not proper!')

        expect(pwdTextOld).toBe(undefined)
    })
    it('Bad inputs 4, no conformation', ()=>{
        const actInput = inputs[counter]
        const { error, field, issue, pwdTextOld } = deleteAccInputRevise(
            actInput.password, actInput.passwordconf
        )

        expect(typeof error).toBe('boolean')
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(1)
        expect(field[0]).toBe('passwordconf')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(1)
        expect(issue[0]).toBe('The password conformation is not proper!')

        expect(pwdTextOld).toBe(undefined)
    })
    it('Bad inputs 5, no inputs', ()=>{
        const actInput = inputs[counter]
        const { error, field, issue, pwdTextOld } = deleteAccInputRevise(
            actInput.password, actInput.passwordconf
        )

        expect(typeof error).toBe('boolean')
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(1)
        expect(field[0]).toBe('password')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(1)
        expect(issue[0]).toBe('The password is not acceptable!')

        expect(pwdTextOld).toBe(undefined)
    })
})