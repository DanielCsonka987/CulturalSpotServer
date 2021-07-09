const bcrypt = require('bcrypt')

const { encryptPwd, matchTextHashPwd } = require('../bCryptManager')

const inputs = [
    { password: 'testText', hash: '$2b$12$qKpEpt0OXmIIyTSqWSVFee37EeivJsPJYkRcX4PypQfUJKT8Va/pq' },
    { password: 'testText', hash: '$2y$12$qKpEpt0OXmIIyTSqWSVFee37EeivJsPJYkRcX4PypQfUJKT8Va/pq' },
    { password: 'test1234', hash: '$2b$12$qKpEpt0OXmIIyTSqWSVFee37EeivJsPJYkRcX4PypQfUJKT8Va/pq'},
    { password: 'testTest', hash: '$2b$12$qKpEpt0OXmIIyTSqWSVFee37'}
]

describe('Password matching tests', ()=>{
    it('Normal setting', async ()=>{
        const actValues = inputs[0];
        const { match, error } = await
            matchTextHashPwd(actValues.password, actValues.hash);

        expect(match).toBeTruthy()
        expect(error).toBeFalsy()
    })
    it('Different standard b->y', async ()=>{
        const actValues = inputs[1];
        const { match, error } = await
            matchTextHashPwd(actValues.password, actValues.hash);

        expect(match).toBeFalsy()
        expect(error).toBeFalsy()
    })
    it('Willingly different pairs', async ()=>{
        const actValues = inputs[2];
        const { match, error } = await
            matchTextHashPwd(actValues.password, actValues.hash);

        expect(match).toBeFalsy()
        expect(error).toBeFalsy()
    })
    it('Hash corrupted (in DB)', async ()=>{
        const actValues = inputs[3];
        const { match, error } = await
            matchTextHashPwd(actValues.password, actValues.hash);

        expect(match).toBeFalsy()
        expect(error).toBeFalsy()
    })
})
describe('Password encoding tests', ()=>{
    it('Text encoding', async ()=>{
        const values = inputs[0]
        const { hash, error } = await encryptPwd(values.password)

        expect(hash).toBeDefined()
        expect(error).toBeFalsy()

        const match = await bcrypt.compare(values.password, hash)
        expect(match).toBeTruthy()
    })
})