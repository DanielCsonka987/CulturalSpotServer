const { changePwdInputRevise } = require('../inputRevise')

describe('Password change tests', ()=>{
    const inputs = [
        { oldpassword: 'testingPwd', newpassword: 'nextpwd', passwordconf: 'nextpwd'},
        { oldpassword: '1', newpassword: 'nextpwd', passwordconf: 'nextpwd'},
        { oldpassword: '', newpassword: 'nextpwd', passwordconf: 'nextpwd'},
        { oldpassword: 'testingPwd', newpassword: 'n', passwordconf: 'n'},
        { oldpassword: 'testingPwd', newpassword: '', passwordconf: ''},
        { oldpassword: 'testingPwd', newpassword: 'nextpwd', passwordconf: 'pwd'},
        { oldpassword: 'testingPwd', newpassword: 'next', passwordconf: 'pwd'},
        { oldpassword: '', newpassword: '', passwordconf: ''},
        { oldpassword: '', newpassword: 'stg', passwordconf: ''}
    ]

    let counter = 0;
    afterEach(()=>{
        counter = counter + 1;
    })

    it('Proper inputs', ()=>{
        const actInput = inputs[counter];
        const { error, field, issue, pwdTextOld, pwdTextNew } = changePwdInputRevise(
            actInput.oldpassword, actInput.newpassword, actInput.passwordconf
        )
        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(pwdTextOld).toBe(actInput.oldpassword)
        expect(pwdTextNew).toBe(actInput.newpassword)

    })
    it('Negative test 1, wrong old pwd', ()=>{
        const actInput = inputs[counter];
        const { error, field, issue, pwdTextOld, pwdTextNew } = changePwdInputRevise(
            actInput.oldpassword, actInput.newpassword, actInput.passwordconf
        )
        
        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(1)
        expect(field[0]).toBe('oldpassword')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(1)
        expect(issue[0]).toBe('The old password is not acceptable!')

        expect(pwdTextOld).toBe(undefined)
        expect(pwdTextNew).toBe(undefined)
    })
    it('Negative test 2, no old pwd', ()=>{
        const actInput = inputs[counter];
        const { error, field, issue, pwdTextOld, pwdTextNew } = changePwdInputRevise(
            actInput.oldpassword, actInput.newpassword, actInput.passwordconf
        )
        
        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(1)
        expect(field[0]).toBe('oldpassword')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(1)
        expect(issue[0]).toBe('The old password is not acceptable!')

        expect(pwdTextOld).toBe(undefined)
        expect(pwdTextNew).toBe(undefined)
    })
    it('Negative test 3, wrong new passwords', ()=>{
        const actInput = inputs[counter];
        const { error, field, issue, pwdTextOld, pwdTextNew } = changePwdInputRevise(
            actInput.oldpassword, actInput.newpassword, actInput.passwordconf
        )
        
        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(1)
        expect(field[0]).toBe('newpassword')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(1)
        expect(issue[0]).toBe('The new password is not acceptable!')

        expect(pwdTextOld).toBe(undefined)
        expect(pwdTextNew).toBe(undefined)
    })
    it('Negative test 4, no new passwords', ()=>{
        const actInput = inputs[counter];
        const { error, field, issue, pwdTextOld, pwdTextNew } = changePwdInputRevise(
            actInput.oldpassword, actInput.newpassword, actInput.passwordconf
        )
        
        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(1)
        expect(field[0]).toBe('newpassword')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(1)
        expect(issue[0]).toBe('The new password is not acceptable!')

        expect(pwdTextOld).toBe(undefined)
        expect(pwdTextNew).toBe(undefined)
    })
    it('Negaitve test 5, bad conformation', ()=>{
        const actInput = inputs[counter];
        const { error, field, issue, pwdTextOld, pwdTextNew } = changePwdInputRevise(
            actInput.oldpassword, actInput.newpassword, actInput.passwordconf
        )
        
        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(1)
        expect(field[0]).toBe('passwordconf')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(1)
        expect(issue[0]).toBe('The new password conformation is not proper!')

        expect(pwdTextOld).toBe(undefined)
        expect(pwdTextNew).toBe(undefined)
    })
    it('Negaitve test 6, bad new passwor and bad conformation', ()=>{
        const actInput = inputs[counter];
        const { error, field, issue, pwdTextOld, pwdTextNew } = changePwdInputRevise(
            actInput.oldpassword, actInput.newpassword, actInput.passwordconf
        )
        
        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(2)
        expect(field[0]).toBe('newpassword')
        expect(field[1]).toBe('passwordconf')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(2)
        expect(issue[0]).toBe('The new password is not acceptable!')
        expect(issue[1]).toBe('The new password conformation is not proper!')

        expect(pwdTextOld).toBe(undefined)
        expect(pwdTextNew).toBe(undefined)
    })
    it('Negative test 7, no inputs', ()=>{
        const actInput = inputs[counter];
        const { error, field, issue, pwdTextOld, pwdTextNew } = changePwdInputRevise(
            actInput.oldpassword, actInput.newpassword, actInput.passwordconf
        )
        
        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(2)
        expect(field[0]).toBe('oldpassword')
        expect(field[1]).toBe('newpassword')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(2)
        expect(issue[0]).toBe('The old password is not acceptable!')
        expect(issue[1]).toBe('The new password is not acceptable!')

        expect(pwdTextOld).toBe(undefined)
        expect(pwdTextNew).toBe(undefined)
    })
    it('Negative test 8, only bad new password', ()=>{
        const actInput = inputs[counter];
        const { error, field, issue, pwdTextOld, pwdTextNew } = changePwdInputRevise(
            actInput.oldpassword, actInput.newpassword, actInput.passwordconf
        )
        
        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(Array.isArray(field)).toBeTruthy()
        expect(field.length).toEqual(3)
        expect(field[0]).toBe('oldpassword')
        expect(field[1]).toBe('newpassword')
        expect(field[2]).toBe('passwordconf')
        expect(Array.isArray(issue)).toBeTruthy()
        expect(issue.length).toEqual(3)
        expect(issue[0]).toBe('The old password is not acceptable!')
        expect(issue[1]).toBe('The new password is not acceptable!')
        expect(issue[2]).toBe('The new password conformation is not proper!')

        expect(pwdTextOld).toBe(undefined)
        expect(pwdTextNew).toBe(undefined)
    })
})