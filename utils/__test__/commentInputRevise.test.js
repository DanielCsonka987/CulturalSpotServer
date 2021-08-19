const { commentQueryInputRevise, opinionCreateInputRevise, 
    commentUpdtInputRevise, sentimentUpdtInputRevise, 
    opinionDeleteInputRevise } = require('../inputRevise')

describe('Query method input revision', ()=>{
    const inputs = [ 
        { targ: 'POST', ids: [ '0123456789abcdef01234567', 'abcdef0123456789abcdef01' ] },
        { targ: 'COMMENT', ids: [ '0123456789abcdef01234567', 'abcdef0123456789abcdef01' ] },
        { targ: 'post', ids: [ '0123456789abcdef01234567', 'abcdef0123456789abcdef01' ] },
        { targ: 'connent', ids: [ '0123456789abcdef01234567', 'abcdef0123456789abcdef01' ] },
        { targ: 'stg', ids: [ '0123456789abcdef01234567', 'abcdef0123456789abcdef01' ] },
        { targ: '', ids: [ '0123456789abcdef01234567', 'abcdef0123456789abcdef01' ] },
        { targ: null , ids: [ '0123456789abcdef01234567', 'abcdef0123456789abcdef01' ] },

        { targ: 'COMMENT', ids: [ '0123456789', 'abcdef0123456789abcdef01' ] }, // no.7
        { targ: 'COMMENT', ids: [ '', '' ] },
        { targ: 'COMMENT', ids: [] },
        { targ: 'COMMENT', ids: null },

        { targ: '', ids: null } //no11
        
     ]
     it('Proper input 1', ()=>{
        const actInput = inputs[0]
        const { error, field, issue, targetingTxt, targetIDs } =
            commentQueryInputRevise(actInput.targ, actInput.ids)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(typeof targetingTxt).toBe('string')
        expect(targetingTxt).toBe(actInput.targ)
        expect(typeof targetIDs).toBe('object')
        expect(targetIDs).toStrictEqual(actInput.ids)
    })
    it('Proper input 2', ()=>{
        const actInput = inputs[1]
        const { error, field, issue, targetingTxt, targetIDs } =
            commentQueryInputRevise(actInput.targ, actInput.ids)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(typeof targetingTxt).toBe('string')
        expect(targetingTxt).toBe(actInput.targ)
        expect(typeof targetIDs).toBe('object')
        expect(targetIDs).toStrictEqual(actInput.ids)
    })
    it('Incorrect input 1', ()=>{
        const actInput = inputs[2]
        const { error, field, issue, targetingTxt, targetIDs } =
            commentQueryInputRevise(actInput.targ, actInput.ids)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetIDs).toBe(undefined)
    })
    it('Incorrect input 2', ()=>{
        const actInput = inputs[3]
        const { error, field, issue, targetingTxt, targetIDs } =
            commentQueryInputRevise(actInput.targ, actInput.ids)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetIDs).toBe(undefined)
    })
    it('Incorrect input 3', ()=>{
        const actInput = inputs[4]
        const { error, field, issue, targetingTxt, targetIDs } =
            commentQueryInputRevise(actInput.targ, actInput.ids)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetIDs).toBe(undefined)
    })
    it('Incorrect input 4', ()=>{
        const actInput = inputs[5]
        const { error, field, issue, targetingTxt, targetIDs } =
            commentQueryInputRevise(actInput.targ, actInput.ids)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetIDs).toBe(undefined)
    })
    it('Incorrect input 5', ()=>{
        const actInput = inputs[6]
        const { error, field, issue, targetingTxt, targetIDs } =
            commentQueryInputRevise(actInput.targ, actInput.ids)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetIDs).toBe(undefined)
    })

    it('Incorrect input 6', ()=>{
        const actInput = inputs[7]
        const { error, field, issue, targetingTxt, targetIDs } =
            commentQueryInputRevise(actInput.targ, actInput.ids)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetIds')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetIds are not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetIDs).toBe(undefined)
    })
    it('Incorrect input 7', ()=>{
        const actInput = inputs[8]
        const { error, field, issue, targetingTxt, targetIDs } =
            commentQueryInputRevise(actInput.targ, actInput.ids)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetIds')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetIds are not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetIDs).toBe(undefined)
    })
    it('Incorrect input 8', ()=>{
        const actInput = inputs[9]
        const { error, field, issue, targetingTxt, targetIDs } =
            commentQueryInputRevise(actInput.targ, actInput.ids)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetIds')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetIds are not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetIDs).toBe(undefined)
    })
    it('Incorrect input 9', ()=>{
        const actInput = inputs[10]
        const { error, field, issue, targetingTxt, targetIDs } =
            commentQueryInputRevise(actInput.targ, actInput.ids)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetIds')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetIds are not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetIDs).toBe(undefined)
    })
    it('Incorrect input 10', ()=>{
        const actInput = inputs[11]
        const { error, field, issue, targetingTxt, targetIDs } =
            commentQueryInputRevise(actInput.targ, actInput.ids)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(2)
        expect(field[0]).toBe('targetType')
        expect(field[1]).toBe('targetIds')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(2)
        expect(issue[0]).toBe('The targetType is not acceptable!')
        expect(issue[1]).toBe('The targetIds are not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetIDs).toBe(undefined)
    })
})

describe('Mutation, creation input revise', ()=>{
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

    it('Proper input 1', ()=>{
        const actInput = inputs[0]
        const { error, field, issue, targetingTxt, targetID, content } =
            opinionCreateInputRevise(actInput.targ, actInput.id, actInput.content)

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
    it('Proper input 2', ()=>{
        const actInput = inputs[1]
        const { error, field, issue, targetingTxt, targetID, content } =
            opinionCreateInputRevise(actInput.targ, actInput.id, actInput.content)

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
    it('Incorrect input 1', ()=>{
        const actInput = inputs[2]
        const { error, field, issue, targetingTxt, targetID, content } =
            opinionCreateInputRevise(actInput.targ, actInput.id, actInput.content)

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
    it('Incorrect input 2', ()=>{
        const actInput = inputs[3]
        const { error, field, issue, targetingTxt, targetID, content } =
            opinionCreateInputRevise(actInput.targ, actInput.id, actInput.content)

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
        const actInput = inputs[4]
        const { error, field, issue, targetingTxt, targetID, content } =
            opinionCreateInputRevise(actInput.targ, actInput.id, actInput.content)

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
        const actInput = inputs[5]
        const { error, field, issue, targetingTxt, targetID, content } =
            opinionCreateInputRevise(actInput.targ, actInput.id, actInput.content)

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
    it('Incorrect input 5', ()=>{
        const actInput = inputs[6]
        const { error, field, issue, targetingTxt, targetID, content } =
            opinionCreateInputRevise(actInput.targ, actInput.id, actInput.content)

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
        const actInput = inputs[7]
        const { error, field, issue, targetingTxt, targetID, content } =
            opinionCreateInputRevise(actInput.targ, actInput.id, actInput.content)

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
        const actInput = inputs[8]
        const { error, field, issue, targetingTxt, targetID, content } =
            opinionCreateInputRevise(actInput.targ, actInput.id, actInput.content)

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
    it('Incorrect input 8', ()=>{
        const actInput = inputs[9]
        const { error, field, issue, targetingTxt, targetID, content } =
            opinionCreateInputRevise(actInput.targ, actInput.id, actInput.content)

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
        const actInput = inputs[10]
        const { error, field, issue, targetingTxt, targetID, content } =
            opinionCreateInputRevise(actInput.targ, actInput.id, actInput.content)

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

describe('Mutation, update comments input revise', ()=>{
    const inputs = [
        { targ: 'POST', id: '0123456789abcdef01234567', 
            objID: 'abcdef0123456789abcdef01', content: 'A testing content' },
        { targ: 'comment', id: '0123456789abcdef01234567', 
            objID: 'abcdef0123456789abcdef01', content: 'A testing content' },
        { targ: '', id: '0123456789abcdef01234567', 
            objID: 'abcdef0123456789abcdef01', content: 'A testing content' },
        { targ: null, id: '0123456789abcdef01234567', 
            objID: 'abcdef0123456789abcdef01', content: 'A testing content' },

        { targ: 'COMMENT', id: '0123456789abcd', 
            objID: 'abcdef0123456789abcdef01', content: 'A testing content' },  //no4
        { targ: 'COMMENT', id: '', 
            objID: 'abcdef0123456789abcdef01', content: 'A testing content' },

        { targ: 'COMMENT', id: '0123456789abcdef01234567', 
            objID: 'abc', content: 'A testing content' },   //no6
        { targ: 'COMMENT', id: '0123456789abcdef01234567', 
            objID: null, content: 'A testing content' },

        { targ: 'POST', id: '0123456789abcdef01234567', 
            objID: 'abcdef0123456789abcdef01', content: '' },   //no8
        { targ: 'POST', id: '0123456789abcdef01234567', 
            objID: 'abcdef0123456789abcdef01', content: null },

        { targ: null, id: '', objID: '012', content: '' }   //no10
    ]

    it('Proper input 1', ()=>{
        const actInput = inputs[0]
        const { error, field, issue, targetingTxt, targetID, commID, content } =
            commentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(typeof targetingTxt).toBe('string')
        expect(targetingTxt).toBe(actInput.targ)
        expect(typeof targetID).toBe('string')
        expect(targetID).toBe(actInput.id)
        expect(typeof commID).toBe('string')
        expect(commID).toBe(actInput.objID)
        expect(typeof content).toBe('string')
        expect(content).toBe(actInput.content)
    })
    it('Incorect input 0', ()=>{
        const actInput = inputs[1]
        const { error, field, issue, targetingTxt, targetID, commID, content } =
            commentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(commID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorrect input 1', ()=>{
        const actInput = inputs[2]
        const { error, field, issue, targetingTxt, targetID, commID, content } =
            commentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(commID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorrect input 2', ()=>{
        const actInput = inputs[3]
        const { error, field, issue, targetingTxt, targetID, commID, content } =
            commentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetType')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetType is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(commID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorrect input 3', ()=>{
        const actInput = inputs[4]
        const { error, field, issue, targetingTxt, targetID, commID, content } =
            commentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(commID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorrect input 4', ()=>{
        const actInput = inputs[5]
        const { error, field, issue, targetingTxt, targetID, commID, content } =
            commentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('targetId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The targetId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(commID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorrect input 5', ()=>{
        const actInput = inputs[6]
        const { error, field, issue, targetingTxt, targetID, commID, content } =
            commentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('commentId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The commentId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(commID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorrect input 6', ()=>{
        const actInput = inputs[7]
        const { error, field, issue, targetingTxt, targetID, commID, content } =
            commentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('commentId')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The commentId is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(commID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorrect input 7', ()=>{
        const actInput = inputs[8]
        const { error, field, issue, targetingTxt, targetID, commID, content } =
            commentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('content')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The content is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(commID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorrect input 8', ()=>{
        const actInput = inputs[9]
        const { error, field, issue, targetingTxt, targetID, commID, content } =
            commentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('content')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The content is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(commID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorrect input 9', ()=>{
        const actInput = inputs[10]
        const { error, field, issue, targetingTxt, targetID, commID, content } =
            commentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(4)
        expect(field[0]).toBe('targetType')
        expect(field[1]).toBe('targetId')
        expect(field[2]).toBe('commentId')
        expect(field[3]).toBe('content')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(4)
        expect(issue[0]).toBe('The targetType is not acceptable!')
        expect(issue[1]).toBe('The targetId is not acceptable!')
        expect(issue[2]).toBe('The commentId is not acceptable!')
        expect(issue[3]).toBe('The content is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
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


    it('Proper input 1', ()=>{
        const actInput = inputs[0]
        const { error, field, issue, targetingTxt, targetID, sentimID, content } =
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
        expect(typeof content).toBe('string')
        expect(content).toBe(actInput.content)
    })
    it('Incorect input 1', ()=>{
        const actInput = inputs[1]
        const { error, field, issue, targetingTxt, targetID, sentimID, content } =
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
        expect(content).toBe(undefined)
    })
    it('Incorect input 2', ()=>{
        const actInput = inputs[2]
        const { error, field, issue, targetingTxt, targetID, sentimID, content } =
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
        expect(content).toBe(undefined)
    })
    it('Incorect input 3', ()=>{
        const actInput = inputs[3]
        const { error, field, issue, targetingTxt, targetID, sentimID, content } =
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
        expect(content).toBe(undefined)
    })
    it('Incorect input 4', ()=>{
        const actInput = inputs[4]
        const { error, field, issue, targetingTxt, targetID, sentimID, content } =
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
        expect(content).toBe(undefined)
    })
    it('Incorect input 5', ()=>{
        const actInput = inputs[5]
        const { error, field, issue, targetingTxt, targetID, sentimID, content } =
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
        expect(content).toBe(undefined)
    })
    it('Incorect input 6', ()=>{
        const actInput = inputs[6]
        const { error, field, issue, targetingTxt, targetID, sentimID, content } =
            sentimentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('content')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The content is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(sentimID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorect input 7', ()=>{
        const actInput = inputs[7]
        const { error, field, issue, targetingTxt, targetID, sentimID, content } =
            sentimentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('content')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The content is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(sentimID).toBe(undefined)
        expect(content).toBe(undefined)
    })
    it('Incorect input 8', ()=>{
        const actInput = inputs[8]
        const { error, field, issue, targetingTxt, targetID, sentimID, content } =
            sentimentUpdtInputRevise(actInput.targ, actInput.id, actInput.objID, actInput.content)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(4)
        expect(field[0]).toBe('targetType')
        expect(field[1]).toBe('targetId')
        expect(field[2]).toBe('sentimentId')
        expect(field[3]).toBe('content')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(4)
        expect(issue[0]).toBe('The targetType is not acceptable!')
        expect(issue[1]).toBe('The targetId is not acceptable!')
        expect(issue[2]).toBe('The sentimentId is not acceptable!')
        expect(issue[3]).toBe('The content is not acceptable!')

        expect(targetingTxt).toBe(undefined)
        expect(targetID).toBe(undefined)
        expect(sentimID).toBe(undefined)
        expect(content).toBe(undefined)
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
    it('Incorrect inputs 1', ()=>{
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
    it('Incorrect inputs 2', ()=>{
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
    it('Incorrect inputs 3', ()=>{
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
    it('Incorrect inputs 4', ()=>{
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
    it('Incorrect inputs 5', ()=>{
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
    it('Incorrect inputs 6', ()=>{
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
    it('Incorrect inputs 7', ()=>{
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
    it('Incorrect inputs 8', ()=>{
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

    it('Incorrect inputs 10', ()=>{
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
    it('Incorrect inputs 11', ()=>{
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
    it('Incorrect inputs 12', ()=>{
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