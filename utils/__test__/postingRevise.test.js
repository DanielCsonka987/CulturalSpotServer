const { postInputRevise, postUpdateInputRevise, postDeleteInputRevise }
     = require('../inputRevise')

describe('Post input revsion tests, creation processes', ()=>{
    const inputs = [
        { dedic: '0123456789abcdef01234567', cont: 'Stg to thest the post creation'  },
        { dedic: '', cont: 'Another text to test post creation'},
        { dedic: '0123', cont: 'Again, testing the post creation'},
        { dedic: '0123456789abcdef01234567', cont: ''},
        { dedic: '', cont: ''}
    ]

    it('Post createion, proper input', ()=>{
        const actInput = inputs[0]
        const { error, field, issue, dedicatedID, postContent } =
            postInputRevise(actInput.dedic, actInput.cont)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(typeof dedicatedID).toBe('string')
        expect(dedicatedID).toBe(actInput.dedic)
        expect(typeof postContent).toBe('string')
        expect(postContent).toBe(actInput.cont)
    })

    it('Post creation, no dedication', ()=>{
        const actInput = inputs[1]
        const { error, field, issue, dedicatedID, postContent } =
            postInputRevise(actInput.dedic, actInput.cont)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(typeof dedicatedID).toBe('string')
        expect(typeof postContent).toBe('string')
        expect(postContent).toBe(actInput.cont)
    })

    it('Post creation, no proper dedication', ()=>{
        const actInput = inputs[2]
        const { error, field, issue, dedicatedID, postContent } =
            postInputRevise(actInput.dedic, actInput.cont)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('dedication')
        
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The userid is not acceptable!')

        expect(dedicatedID).toBe(undefined)
        expect(postContent).toBe(undefined)
    })
    it('Post creation, no proper content', ()=>{
        const actInput = inputs[3]
        const { error, field, issue, dedicatedID, postContent } =
            postInputRevise(actInput.dedic, actInput.cont)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('postContent')
        
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The post content is not acceptable!')

        expect(dedicatedID).toBe(undefined)
        expect(postContent).toBe(undefined)
    })
    it('Post creation, no input at all', ()=>{
        const actInput = inputs[4]
        const { error, field, issue, dedicatedID, postContent } =
            postInputRevise(actInput.dedic, actInput.cont)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('postContent')
        
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The post content is not acceptable!')

        expect(dedicatedID).toBe(undefined)
        expect(postContent).toBe(undefined)
    })
})

describe('Post updateing process tests', ()=>{
    const inputs = [
        { id: '0123456789abcdef01234567', dedic: '01234567890123456789abcd', cont: 'Text as new post content'},
        { id: '0123456789abcdef01234567', dedic: '', cont: 'Text as new post content'},
        { id: '0123456789abcdef01234567', dedic: '012abc', cont: 'Text as new post content'},
        { id: '0123456', dedic: '01234567890123456789abcd', cont: 'Text as new post content'},
        { id: '', dedic: '', cont: 'Text as new post content'},
        { id: '0123456789abcdef01234567', dedic: '01234567890123456789abcd', cont: ''},
        { id: '', dedic: '', cont: ''},
    ]
    it('Post update with correct inputs', ()=>{
        const actInput = inputs[0]
        const { error, field, issue, postID, newContent, dedicatedID } =
            postUpdateInputRevise(actInput.id, actInput.cont, actInput.dedic)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(typeof postID).toBe('string')
        expect(postID).toBe(actInput.id)
        expect(typeof newContent).toBe('string')
        expect(newContent).toBe(actInput.cont)
        expect(typeof dedicatedID).toBe('string')
        expect(dedicatedID).toBe(actInput.dedic)
    })

    it('Post update with no addressee', ()=>{
        const actInput = inputs[1]
        const { error, field, issue, postID, newContent, dedicatedID } =
            postUpdateInputRevise(actInput.id, actInput.cont, actInput.dedic)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(typeof postID).toBe('string')
        expect(postID).toBe(actInput.id)
        expect(typeof newContent).toBe('string')
        expect(newContent).toBe(actInput.cont)
        expect(typeof dedicatedID).toBe('string')
        expect(dedicatedID).toBe(actInput.dedic)
    })

    it('Post update without correct addressee input', ()=>{
        const actInput = inputs[2]
        const { error, field, issue, postID, newContent, dedicatedID } =
            postUpdateInputRevise(actInput.id, actInput.cont, actInput.dedic)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('newDedication')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The userid is not acceptable!')

        expect(postID).toBe(undefined)
        expect(newContent).toBe(undefined)
        expect(dedicatedID).toBe(undefined)
    })
    it('Post update without correct postid input', ()=>{
        const actInput = inputs[3]
        const { error, field, issue, postID, newContent, dedicatedID } =
            postUpdateInputRevise(actInput.id, actInput.cont, actInput.dedic)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('postid')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The postid is not acceptable!')

        expect(postID).toBe(undefined)
        expect(newContent).toBe(undefined)
        expect(dedicatedID).toBe(undefined)
    })
    it('Post update without postid input', ()=>{
        const actInput = inputs[4]
        const { error, field, issue, postID, newContent, dedicatedID } =
            postUpdateInputRevise(actInput.id, actInput.cont, actInput.dedic)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('postid')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The postid is not acceptable!')

        expect(postID).toBe(undefined)
        expect(newContent).toBe(undefined)
        expect(dedicatedID).toBe(undefined)
    })
    it('Post update without content input', ()=>{
        const actInput = inputs[5]
        const { error, field, issue, postID, newContent, dedicatedID } =
            postUpdateInputRevise(actInput.id, actInput.cont, actInput.dedic)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('postContent')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The post content is not acceptable!')

        expect(postID).toBe(undefined)
        expect(newContent).toBe(undefined)
        expect(dedicatedID).toBe(undefined)
    })
    it('Post update without input', ()=>{
        const actInput = inputs[6]
        const { error, field, issue, postID, newContent, dedicatedID } =
            postUpdateInputRevise(actInput.id, actInput.cont, actInput.dedic)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(2)
        expect(field[0]).toBe('postid')
        expect(field[1]).toBe('postContent')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(2)
        expect(issue[0]).toBe('The postid is not acceptable!')
        expect(issue[1]).toBe('The post content is not acceptable!')

        expect(postID).toBe(undefined)
        expect(newContent).toBe(undefined)
        expect(dedicatedID).toBe(undefined)
    })
})

describe('Post deletion process', ()=>{
    const inputs = [
        '0123456789abcdef01234567', '', '0123456789ab'
    ]

    it('Post deletion with correct inputs', ()=>{
        const actInput = inputs[0]
        const { error, field, issue, postID } = postDeleteInputRevise(actInput)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(typeof postID).toBe('string')
        expect(postID).toBe(actInput)
    })

    it('Post delete without proper postid input', ()=>{
        const actInput = inputs[1]
        const { error, field, issue, postID } = postDeleteInputRevise(actInput)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('postid')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The postid is not acceptable!')

        expect(postID).toBe(undefined)
    })

    it('Post delete without postid input', ()=>{
        const actInput = inputs[2]
        const { error, field, issue, postID } =  postDeleteInputRevise(actInput)

        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('postid')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The postid is not acceptable!')

        expect(postID).toBe(undefined)
    })
})