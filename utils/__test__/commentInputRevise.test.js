const { isNullableType } = require('graphql')
const { commentQueryInputRevise, commentCreateInputRevise, sentimentCreateInputRevise, 
    commentUpdtInputRevise, sentimentUpdtInputRevise,  opinionDeleteInputRevise } 
    = require('../inputRevise')

describe('Query method input revision', ()=>{
    const inputs = [ 
        { targ: 'POST', id: '0123456789abcdef01234567' },
        { targ: 'COMMENT', id: '0123456789abcdef01234567' },
        { targ: 'post', id: '0123456789abcdef01234567' },   // no2
        { targ: 'connent', id: '0123456789abcdef01234567' },
        { targ: 'stg', id: '0123456789abcdef01234567' },
        { targ: '', id: '0123456789abcdef01234567' },
        { targ: null , id: '0123456789abcdef01234567' },

        { targ: 'COMMENT', id: '0123456789', }, // no.7
        { targ: 'COMMENT', id: '' },
        { targ: 'COMMENT', ids: [] },
        { targ: 'COMMENT', ids: null },

        { targ: '', ids: null } //no11
        
     ]
     it('Proper input 0', ()=>{
        const actInput = inputs[0]
        const { error, field, issue, targetingTxt, targetID } =
            commentQueryInputRevise(actInput.targ, actInput.id)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(typeof targetingTxt).toBe('string')
        expect(targetingTxt).toBe(actInput.targ)
        expect(typeof targetID).toBe('string')
        expect(targetID).toStrictEqual(actInput.id)
    })
    it('Proper input 1', ()=>{
        const actInput = inputs[1]
        const { error, field, issue, targetingTxt, targetID } =
            commentQueryInputRevise(actInput.targ, actInput.id)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(typeof targetingTxt).toBe('string')
        expect(targetingTxt).toBe(actInput.targ)
        expect(typeof targetID).toBe('string')
        expect(targetID).toStrictEqual(actInput.id)
    })
    it('Incorrect input 2 - target type', ()=>{
        const actInput = inputs[2]
        const { error, field, issue, targetingTxt, targetID } =
            commentQueryInputRevise(actInput.targ, actInput.id)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
    })
    it('Incorrect input 3', ()=>{
        const actInput = inputs[3]
        const { error, field, issue, targetingTxt, targetID } =
            commentQueryInputRevise(actInput.targ, actInput.id)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
    })
    it('Incorrect input 4', ()=>{
        const actInput = inputs[4]
        const { error, field, issue, targetingTxt, targetID } =
            commentQueryInputRevise(actInput.targ, actInput.id)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
    })
    it('Incorrect input 5', ()=>{
        const actInput = inputs[5]
        const { error, field, issue, targetingTxt, targetID } =
            commentQueryInputRevise(actInput.targ, actInput.id)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
    })
    it('Incorrect input 6', ()=>{
        const actInput = inputs[6]
        const { error, field, issue, targetingTxt, targetID } =
            commentQueryInputRevise(actInput.targ, actInput.id)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
    })

    it('Incorrect input 7 targetid', ()=>{
        const actInput = inputs[7]
        const { error, field, issue, targetingTxt, targetID } =
            commentQueryInputRevise(actInput.targ, actInput.id)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
    })
    it('Incorrect input 8', ()=>{
        const actInput = inputs[8]
        const { error, field, issue, targetingTxt, targetID } =
            commentQueryInputRevise(actInput.targ, actInput.id)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
    })
    it('Incorrect input 9', ()=>{
        const actInput = inputs[9]
        const { error, field, issue, targetingTxt, targetID } =
            commentQueryInputRevise(actInput.targ, actInput.id)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
    })
    it('Incorrect input 10', ()=>{
        const actInput = inputs[10]
        const { error, field, issue, targetingTxt, targetID } =
            commentQueryInputRevise(actInput.targ, actInput.id)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
    })
    it('Incorrect input 11 all', ()=>{
        const actInput = inputs[11]
        const { error, field, issue, targetingTxt, targetID } =
            commentQueryInputRevise(actInput.targ, actInput.id)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(2)
        expect(field[0]).toBe('targetType')
        expect(field[1]).toBe('targetId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(2)
        expect(issue[0]).toBe('The targetType is not acceptable!')
        expect(issue[1]).toBe('The targetId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
    })
})

describe('Mutation, comment creation input revise', ()=>{
    const inputs = [
        { targ: 'POST', id: '0123456789abcdef01234567', content: 'Stg to test' },
        { targ: 'COMMENT', id: '0123456789abcdef01234567', content: 'Stg to test' },
        { targ: 'comment', id: '0123456789abcdef01234567', content: 'Stg to test' },
        { targ: '', id: '0123456789abcdef01234567', content: 'Stg to test' },
        { targ: null , id: '0123456789abcdef01234567', content: 'Stg to test' },

        { targ: 'POST', id: '0123456789abcdef', content: 'Stg to test' },   //no5
        { targ: 'COMMENT', id: '', content: 'Stg to test' },
        { targ: 'COMMENT', id: null, content: 'Stg to test' },

        { targ: 'COMMENT', id: '0123456789abcdef01234567', content: '' },   //no8
        { targ: 'POST', id: '0123456789abcdef01234567', content: null },

        { targ: 'P', id: '', content: null } //no10
    ]

    it('Proper input 0', ()=>{
        const actInput = inputs[0]
        const { error, field, issue, targetingTxt, targetID, content } =
            commentCreateInputRevise(actInput.targ, actInput.id, actInput.content)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(typeof targetingTxt).toBe('string')
        expect(targetingTxt).toBe(actInput.targ)
        expect(typeof targetID).toBe('string')
        expect(targetID).toBe(actInput.id)
        expect(typeof content).toBe('string')
        expect(content).toBe(actInput.content)
    })
    it('Proper input 1', ()=>{
        const actInput = inputs[1]
        const { error, field, issue, targetingTxt, targetID, content } =
            commentCreateInputRevise(actInput.targ, actInput.id, actInput.content)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(typeof targetingTxt).toBe('string')
        expect(targetingTxt).toBe(actInput.targ)
        expect(typeof targetID).toBe('string')
        expect(targetID).toBe(actInput.id)
        expect(typeof content).toBe('string')
        expect(content).toBe(actInput.content)
    })
    it('Incorrect input 2 target type', ()=>{
        const actInput = inputs[2]
        const { error, field, issue, targetingTxt, targetID, content } =
            commentCreateInputRevise(actInput.targ, actInput.id, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorrect input 3', ()=>{
        const actInput = inputs[3]
        const { error, field, issue, targetingTxt, targetID, content } =
            commentCreateInputRevise(actInput.targ, actInput.id, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorrect input 4', ()=>{
        const actInput = inputs[4]
        const { error, field, issue, targetingTxt, targetID, content } =
            commentCreateInputRevise(actInput.targ, actInput.id, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorrect input 5 targetId', ()=>{
        const actInput = inputs[5]
        const { error, field, issue, targetingTxt, targetID, content } =
            commentCreateInputRevise(actInput.targ, actInput.id, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorrect input 6', ()=>{
        const actInput = inputs[6]
        const { error, field, issue, targetingTxt, targetID, content } =
            commentCreateInputRevise(actInput.targ, actInput.id, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorrect input 7', ()=>{
        const actInput = inputs[7]
        const { error, field, issue, targetingTxt, targetID, content } =
            commentCreateInputRevise(actInput.targ, actInput.id, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorrect input 8 content', ()=>{
        const actInput = inputs[8]
        const { error, field, issue, targetingTxt, targetID, content } =
            commentCreateInputRevise(actInput.targ, actInput.id, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('content')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The content is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorrect input 9', ()=>{
        const actInput = inputs[9]
        const { error, field, issue, targetingTxt, targetID, content } =
            commentCreateInputRevise(actInput.targ, actInput.id, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('content')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The content is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorrect input 10 all', ()=>{
        const actInput = inputs[10]
        const { error, field, issue, targetingTxt, targetID, content } =
            commentCreateInputRevise(actInput.targ, actInput.id, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(3)
        expect(field[0]).toBe('targetType')
        expect(field[1]).toBe('targetId')
        expect(field[2]).toBe('content')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(3)
        expect(issue[0]).toBe('The targetType is not acceptable!')
        expect(issue[1]).toBe('The targetId is not acceptable!')
        expect(issue[2]).toBe('The content is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(content).toBe(undefined)
    })
})

describe('Mutation, sentiment creation input revise', ()=>{
    const inputs = [
        { targ: 'POST', id: '01234abcdef0123456789abc', cont: 'SAD'},
        { targ: 'COMMENT', id: '01234abcdef0123456789abc', cont: 'LIKE'},

        { targ: 'P', id: '01234abcdef0123456789abc', cont: 'DISLIKE'},  //no.2
        { targ: '', id: '01234abcdef0123456789abc', cont: 'MAD'},
        { targ: null, id: '01234abcdef0123456789abc', cont: 'SAD'},

        { targ: 'POST', id: '012349abc', cont: 'LIKE'}, //no.5
        { targ: 'POST', id: '', cont: 'FUNNY'},
        { targ: 'POST', id: null, cont: 'SAD'},

        { targ: 'POST', id: '01234abcdef0123456789abc', cont: ''}, //no.8
        { targ: 'POST', id: '01234abcdef0123456789abc', cont: null},

        { targ: 'stg', id: '', cont: null}, //no.10
        
    ]
    it('Proper input 0', ()=>{
        const actInput = inputs[0]
        const { error, field, issue, targetingTxt, targetID, sentimCont } =
            sentimentCreateInputRevise(actInput.targ, actInput.id, actInput.cont)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(typeof targetingTxt).toBe('string')
        expect(targetingTxt).toBe(actInput.targ)
        expect(typeof targetID).toBe('string')
        expect(targetID).toBe(actInput.id)
        expect(typeof sentimCont).toBe('string')
        expect(sentimCont).toBe(actInput.cont)
    })
    it('Proper input 1', ()=>{
        const actInput = inputs[1]
        const { error, field, issue, targetingTxt, targetID, sentimCont } =
            sentimentCreateInputRevise(actInput.targ, actInput.id, actInput.cont)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(typeof targetingTxt).toBe('string')
        expect(targetingTxt).toBe(actInput.targ)
        expect(typeof targetID).toBe('string')
        expect(targetID).toBe(actInput.id)
        expect(typeof sentimCont).toBe('string')
        expect(sentimCont).toBe(actInput.cont)
    })

    it('Incorrect input 2 target type', ()=>{
        const actInput = inputs[2]
        const { error, field, issue, targetingTxt, targetID, sentimCont } =
            sentimentCreateInputRevise(actInput.targ, actInput.id, actInput.cont)

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(sentimCont).toBe(undefined)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')
    })
    it('Incorrect input 3', ()=>{
        const actInput = inputs[3]
        const { error, field, issue, targetingTxt, targetID, sentimCont } =
            sentimentCreateInputRevise(actInput.targ, actInput.id, actInput.cont)

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(sentimCont).toBe(undefined)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')
    })
    it('Incorrect input 4', ()=>{
        const actInput = inputs[4]
        const { error, field, issue, targetingTxt, targetID, sentimCont } =
            sentimentCreateInputRevise(actInput.targ, actInput.id, actInput.cont)

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(sentimCont).toBe(undefined)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')
    })
    it('Incorrect input 5 targetId', ()=>{
        const actInput = inputs[5]
        const { error, field, issue, targetingTxt, targetID, sentimCont } =
            sentimentCreateInputRevise(actInput.targ, actInput.id, actInput.cont)

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(sentimCont).toBe(undefined)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetId is not acceptable!')
    })
    it('Incorrect input 6', ()=>{
        const actInput = inputs[6]
        const { error, field, issue, targetingTxt, targetID, sentimCont } =
            sentimentCreateInputRevise(actInput.targ, actInput.id, actInput.cont)

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(sentimCont).toBe(undefined)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetId is not acceptable!')
    })
    it('Incorrect input 7', ()=>{
        const actInput = inputs[7]
        const { error, field, issue, targetingTxt, targetID, sentimCont } =
            sentimentCreateInputRevise(actInput.targ, actInput.id, actInput.cont)

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(sentimCont).toBe(undefined)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetId is not acceptable!')
    })
    it('Incorrect input 8 sentim.content', ()=>{
        const actInput = inputs[8]
        const { error, field, issue, targetingTxt, targetID, sentimCont } =
            sentimentCreateInputRevise(actInput.targ, actInput.id, actInput.cont)

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(sentimCont).toBe(undefined)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('sentimContent')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The sentiment content is not acceptable!')
    })
    it('Incorrect input 9', ()=>{
        const actInput = inputs[9]
        const { error, field, issue, targetingTxt, targetID, sentimCont } =
            sentimentCreateInputRevise(actInput.targ, actInput.id, actInput.cont)

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(sentimCont).toBe(undefined)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('sentimContent')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The sentiment content is not acceptable!')
    })
    it('Incorrect input 10 all', ()=>{
        const actInput = inputs[10]
        const { error, field, issue, targetingTxt, targetID, sentimCont } =
            sentimentCreateInputRevise(actInput.targ, actInput.id, actInput.cont)

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(sentimCont).toBe(undefined)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(3)
        expect(field[0]).toBe('targetType')
        expect(field[1]).toBe('targetId')
        expect(field[2]).toBe('sentimContent')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(3)
        expect(issue[0]).toBe('The targetType is not acceptable!')
        expect(issue[1]).toBe('The targetId is not acceptable!')
        expect(issue[2]).toBe('The sentiment content is not acceptable!')
    })
})


describe('Mutation, update comments input revise', ()=>{
    const inputs = [
        { id: '0123456789abcdef01234567',  content: 'A testing content' },

        { id: '012345674567',  content: 'A testing content' },  //no.1
        { id: '',  content: 'A testing content' },
        { id: null,  content: 'A testing content' },

        { id: '0123456789abcdef01234567', content: '' },  //no.4
        { id: '0123456789abcdef01234567', content: null },

        {  id: '', content: '' }   //no.6
    ]

    it('Proper input 1', ()=>{
        const actInput = inputs[0]
        const { error, field, issue, commID, content } =
            commentUpdtInputRevise(actInput.id, actInput.content)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(typeof commID).toBe('string')
        expect(commID).toBe(actInput.id)
        expect(typeof content).toBe('string')
        expect(content).toBe(actInput.content)
    })
   
    it('Incorrect input 1 commentId', ()=>{
        const actInput = inputs[1]
        const { error, field, issue, commID, content } =
            commentUpdtInputRevise(actInput.id, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('commentId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The commentId is not acceptable!')

        expect(commID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorrect input 2', ()=>{
        const actInput = inputs[2]
        const { error, field, issue, commID, content } =
            commentUpdtInputRevise(actInput.id, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('commentId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The commentId is not acceptable!')

        expect(commID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorrect input 3', ()=>{
        const actInput = inputs[3]
        const { error, field, issue, commID, content } =
            commentUpdtInputRevise(actInput.id, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('commentId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The commentId is not acceptable!')

        expect(commID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorrect input 4 content', ()=>{
        const actInput = inputs[4]
        const { error, field, issue,  commID, content } =
            commentUpdtInputRevise(actInput.id, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('content')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The content is not acceptable!')

        expect(commID).toBe(undefined)
        expect(content).toBe(undefined)
    })

    it('Incorrect input 5 content', ()=>{
        const actInput = inputs[5]
        const { error, field, issue,  commID, content } =
            commentUpdtInputRevise(actInput.id, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('content')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The content is not acceptable!')

        expect(commID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    
    it('Incorrect input 6 all', ()=>{
        const actInput = inputs[6]
        const { error, field, issue, commID, content } =
            commentUpdtInputRevise(actInput.id,actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(2)
        expect(field[0]).toBe('commentId')
        expect(field[1]).toBe('content')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(2)
        expect(issue[0]).toBe('The commentId is not acceptable!')
        expect(issue[1]).toBe('The content is not acceptable!')

        expect(commID).toBe(undefined)
        expect(content).toBe(undefined)
    })
})

describe('Mutation, update sentiments input revise', ()=>{

    const inputs = [    //the same as comment version
        { targ: 'POST', id: '0123456789abcdef01234567', 
            objID: 'abcdef0123456789abcdef01', content: 'LIKE' },
        { targ: null, id: '0123456789abcdef01234567', 
            objID: 'abcdef0123456789abcdef01', content: 'MAD' },

        { targ: 'COMMENT', id: '0123456789abcd', 
            objID: 'abcdef0123456789abcdef01', content: 'DISLIKE' },  //no2
        { targ: 'COMMENT', id: '', 
            objID: 'abcdef0123456789abcdef01', content: 'FUNNY' },

        { targ: 'COMMENT', id: '0123456789abcdef01234567', 
            objID: 'abc', content: 'SAD' },             //no4
        { targ: 'COMMENT', id: '0123456789abcdef01234567', 
            objID: null, content: 'LOVE' },

        { targ: 'POST', id: '0123456789abcdef01234567', 
            objID: 'abcdef0123456789abcdef01', content: '' },   //no6
        { targ: 'POST', id: '0123456789abcdef01234567', 
            objID: 'abcdef0123456789abcdef01', content: null },

        { targ: null, id: '', objID: '012', content: '' }   //no8
    ]


    it('Proper input 0', ()=>{
        const actInput = inputs[0]
        const { error, field, issue, targetingTxt, targetID, sentimID, sentimCont } =
            sentimentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(typeof targetingTxt).toBe('string')
        expect(targetingTxt).toBe(actInput.targ)
        expect(typeof targetID).toBe('string')
        expect(targetID).toBe(actInput.id)
        expect(typeof sentimID).toBe('string')
        expect(sentimID).toBe(actInput.objID)
        expect(typeof sentimCont).toBe('string')
        expect(sentimCont).toBe(actInput.content)
    })
    it('Incorect input 1 target type', ()=>{
        const actInput = inputs[1]
        const { error, field, issue, targetingTxt, targetID, sentimID, sentimCont } =
            sentimentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(sentimID).toBe(undefined)
        expect(sentimCont).toBe(undefined)
    })
    it('Incorect input 2 targetId', ()=>{
        const actInput = inputs[2]
        const { error, field, issue, targetingTxt, targetID, sentimID, sentimCont } =
            sentimentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(sentimID).toBe(undefined)
        expect(sentimCont).toBe(undefined)
    })
    it('Incorect input 3', ()=>{
        const actInput = inputs[3]
        const { error, field, issue, targetingTxt, targetID, sentimID, sentimCont } =
            sentimentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(sentimID).toBe(undefined)
        expect(sentimCont).toBe(undefined)
    })
    it('Incorect input 4 setntimentId', ()=>{
        const actInput = inputs[4]
        const { error, field, issue, targetingTxt, targetID, sentimID, sentimCont } =
            sentimentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('sentimentId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The sentimentId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(sentimID).toBe(undefined)
        expect(sentimCont).toBe(undefined)
    })
    it('Incorect input 5', ()=>{
        const actInput = inputs[5]
        const { error, field, issue, targetingTxt, targetID, sentimID, sentimCont } =
            sentimentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('sentimentId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The sentimentId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(sentimID).toBe(undefined)
        expect(sentimCont).toBe(undefined)
    })
    it('Incorect input 6 content', ()=>{
        const actInput = inputs[6]
        const { error, field, issue, targetingTxt, targetID, sentimID, sentimCont } =
            sentimentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('sentimContent')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The sentiment content is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(sentimID).toBe(undefined)
        expect(sentimCont).toBe(undefined)
    })
    it('Incorect input 7', ()=>{
        const actInput = inputs[7]
        const { error, field, issue, targetingTxt, targetID, sentimID, sentimCont } =
            sentimentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('sentimContent')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The sentiment content is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(sentimID).toBe(undefined)
        expect(sentimCont).toBe(undefined)
    })
    it('Incorect input 8 all', ()=>{
        const actInput = inputs[8]
        const { error, field, issue, targetingTxt, targetID, sentimID, sentimCont } =
            sentimentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(4)
        expect(field[0]).toBe('targetType')
        expect(field[1]).toBe('targetId')
        expect(field[2]).toBe('sentimentId')
        expect(field[3]).toBe('sentimContent')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(4)
        expect(issue[0]).toBe('The targetType is not acceptable!')
        expect(issue[1]).toBe('The targetId is not acceptable!')
        expect(issue[2]).toBe('The sentimentId is not acceptable!')
        expect(issue[3]).toBe('The sentiment content is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(sentimID).toBe(undefined)
        expect(sentimCont).toBe(undefined)
    })
})

describe('Mutation, deletion input revise', ()=>{
    const inputs = [ 
        { targ: 'POST', id: '0123456789abcdef01234567', objID: 'abcdef0123456789abcdef01' },
        { targ: 'COMMENT', id: '0123456789abcdef01234567', objID: 'abcdef0123456789abcdef01' },
        { targ: 'post', id: '0123456789abcdef01234567', objID: 'abcdef0123456789abcdef01' },
        { targ: 'connent', id: '0123456789abcdef01234567', objID: 'abcdef0123456789abcdef01' },
        { targ: 'stg', id:'0123456789abcdef01234567', objID: 'abcdef0123456789abcdef01' },
        { targ: '', id: '0123456789abcdef01234567', objID: 'abcdef0123456789abcdef01'  },
        { targ: null , id: '0123456789abcdef01234567', objID: 'abcdef0123456789abcdef01' },

        { targ: 'COMMENT', id: '0123456789', objID: 'abcdef0123456789abcdef01'  },  //no7
        { targ: 'COMMENT', id: '', objID: 'abcdef0123456789abcdef01'  },
        { targ: 'COMMENT', id: null, objID: 'abcdef0123456789abcdef01' },

        { targ: 'COMMENT', id: '0123456789abcdef01234567', objID: 'abcdef0123456' },   //no10
        { targ: 'COMMENT', id: '0123456789abcdef01234567', objID: '' },
        { targ: 'COMMENT', id: '0123456789abcdef01234567', objID: null },

        { targ: '', id: null, objID: '0' }  //no13
    ]

    it('Proper input 0', ()=>{
        const actInput = inputs[0]
        const { error, field, issue, targetingTxt, targetID, ID } =
            opinionDeleteInputRevise(actInput.targ, actInput.id, actInput.objID )

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(typeof targetingTxt).toBe('string')
        expect(targetingTxt).toBe(actInput.targ)
        expect(typeof targetID).toBe('string')
        expect(targetID).toBe(actInput.id)
        expect(typeof ID).toBe('string')
        expect(ID).toBe(actInput.objID)
    })
    it('Proper input 1', ()=>{
        const actInput = inputs[1]
        const { error, field, issue, targetingTxt, targetID, ID } =
            opinionDeleteInputRevise(actInput.targ, actInput.id, actInput.objID )

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(typeof targetingTxt).toBe('string')
        expect(targetingTxt).toBe(actInput.targ)
        expect(typeof targetID).toBe('string')
        expect(targetID).toBe(actInput.id)
        expect(typeof ID).toBe('string')
        expect(ID).toBe(actInput.objID)
    })
    it('Incorrect inputs 2 target type', ()=>{
        const actInput = inputs[2]
        const { error, field, issue, targetingTxt, targetID, ID } =
            opinionDeleteInputRevise(actInput.targ, actInput.id, actInput.objID )

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(ID).toBe(undefined)
    })
    it('Incorrect inputs 3', ()=>{
        const actInput = inputs[3]
        const { error, field, issue, targetingTxt, targetID, ID } =
            opinionDeleteInputRevise(actInput.targ, actInput.id, actInput.objID )

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(ID).toBe(undefined)
    })
    it('Incorrect inputs 4', ()=>{
        const actInput = inputs[4]
        const { error, field, issue, targetingTxt, targetID, ID } =
            opinionDeleteInputRevise(actInput.targ, actInput.id, actInput.objID )

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(ID).toBe(undefined)
    })
    it('Incorrect inputs 5', ()=>{
        const actInput = inputs[5]
        const { error, field, issue, targetingTxt, targetID, ID } =
            opinionDeleteInputRevise(actInput.targ, actInput.id, actInput.objID )

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(ID).toBe(undefined)
    })
    it('Incorrect inputs 6', ()=>{
        const actInput = inputs[6]
        const { error, field, issue, targetingTxt, targetID, ID } =
            opinionDeleteInputRevise(actInput.targ, actInput.id, actInput.objID )

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(ID).toBe(undefined)
    })
    it('Incorrect inputs 7 targetId', ()=>{
        const actInput = inputs[7]
        const { error, field, issue, targetingTxt, targetID, ID } =
            opinionDeleteInputRevise(actInput.targ, actInput.id, actInput.objID )

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(ID).toBe(undefined)
    })
    it('Incorrect inputs 8', ()=>{
        const actInput = inputs[8]
        const { error, field, issue, targetingTxt, targetID, ID } =
            opinionDeleteInputRevise(actInput.targ, actInput.id, actInput.objID )

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(ID).toBe(undefined)
    })
    it('Incorrect inputs 9', ()=>{
        const actInput = inputs[9]
        const { error, field, issue, targetingTxt, targetID, ID } =
            opinionDeleteInputRevise(actInput.targ, actInput.id, actInput.objID )

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(ID).toBe(undefined)
    })

    it('Incorrect inputs 10 opinionId', ()=>{
        const actInput = inputs[10]
        const { error, field, issue, targetingTxt, targetID, ID } =
            opinionDeleteInputRevise(actInput.targ, actInput.id, actInput.objID )

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('opinionId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The opinionId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(ID).toBe(undefined)
        
    })
    it('Incorrect inputs 11', ()=>{
        const actInput = inputs[11]
        const { error, field, issue, targetingTxt, targetID, ID } =
            opinionDeleteInputRevise(actInput.targ, actInput.id, actInput.objID )

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('opinionId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The opinionId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(ID).toBe(undefined)
        
    })
    it('Incorrect inputs 12', ()=>{
        const actInput = inputs[12]
        const { error, field, issue, targetingTxt, targetID, ID } =
            opinionDeleteInputRevise(actInput.targ, actInput.id, actInput.objID )

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('opinionId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The opinionId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(ID).toBe(undefined)
        
    })
    it('Incorrect inputs 13 all', ()=>{
        const actInput = inputs[13]
        const { error, field, issue, targetingTxt, targetID, ID } =
            opinionDeleteInputRevise(actInput.targ, actInput.id, actInput.objID )

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(3)
        expect(field[0]).toBe('targetType')
        expect(field[1]).toBe('targetId')
        expect(field[2]).toBe('opinionId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(3)
        expect(issue[0]).toBe('The targetType is not acceptable!')
        expect(issue[1]).toBe('The targetId is not acceptable!')
        expect(issue[2]).toBe('The opinionId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(ID).toBe(undefined)
    })


})