const { tokenEncoder, tokenVerify } = require('../tokenManager')

fit('Test', async ()=>{
    const token = tokenEncoder({ msg: 'text' })

    const res = await tokenVerify(token)

    expect(res.msg).toBe('text')
})