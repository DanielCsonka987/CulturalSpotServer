const { chatRoomCreateInputRevise, chatMessagesQueryInputRevise,
    chatRoomAddRemovePartnersInputRevise, chatRoomUpdateInputRevise,
    chatRoomDelteInputRevise, sendMessageInputRevise,
    updateMessageInputRvise, deleteMessageInputRevise
    } = require('../inputRevise')

describe('Chat messages query input reviseion tests', ()=>{
    const inputs = [
        { id: '0123456789abcdef01234567', date: '2020-12-11T10:34:00.000Z', amount: 1 },
        { id: '0123456789abcdef01234567', date: '2020-12-11T10:34:00.000Z', amount: 14 },
        { id: '0123456789abcdef01234567', date: '2020-12-11T10:34:00.000Z', amount: null },
        { id: '0123456789abcdef01234567', date: '2020-12-11T10:34:00.000Z' },
        { id: '0123456789abcdef01234567', date: null, amount: 2 },
        { id: '0123456789abcdef01234567', amount: 2 },
        // pointer 6
        { id: '0123456789abcdef01', date: '2020-12-11T10:34:00.000Z', amount: 14 },
        // pointer 7
        { id: '0123456789abcdef01234567', date: 2001, amount: 2 },
        { id: '0123456789abcdef01234567', date: '04 May 2020 12:33 UTC', amount: 3 },
        { id: '0123456789abcdef01234567', date: '2020-12-11T10:34:00.000', amount: 4 },
        { id: '0123456789abcdef01234567', date: '2020-12-11 10:34:00.000Z', amount: 5 },
        // pointer 12
        { id: '0123456789abcdef01234567', date: '2020-12-11T10:34:00.000Z', amount: -1 },
        { id: '0123456789abcdef01234567', date: '2020-12-11T10:34:00.000Z', amount: 0 },
        { id: '0123456789abcdef01234567', date: '2020-12-11T10:34:00.000Z', amount: 'five'},
        // pointer 14
        { id: '0123456789abcde', date: 2011, amount: 'five' },
        { id: '0123456789abcde', date: '2011', amount: -1 }
    ]

    it('Proper input 0', ()=>{
        const actInput = inputs[0]
        const {error, field, issue, chatid, date, amount} =
            chatMessagesQueryInputRevise(actInput.id, actInput.date, actInput.amount)
        expect(typeof chatid).toBe('string')
        expect(chatid).toEqual(actInput.id)
        expect(typeof date).toBe('object')
        expect(date.toISOString()).toMatch('2020-12-11T10:34:00.000Z')
        expect(typeof amount).toBe('number')
        expect(amount).toBe(1)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)
    })
    it('Proper input 1', ()=>{
        const actInput = inputs[1]
        const {error, field, issue, chatid, date, amount} =
            chatMessagesQueryInputRevise(actInput.id, actInput.date, actInput.amount)
        expect(typeof chatid).toBe('string')
        expect(chatid).toEqual(actInput.id)
        expect(typeof date).toBe('object')
        expect(date.toISOString()).toMatch('2020-12-11T10:34:00.000Z')
        expect(typeof amount).toBe('number')
        expect(amount).toBe(14)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)
    })
    it('Proper input 2', ()=>{
        const actInput = inputs[2]
        const {error, field, issue, chatid, date, amount} =
            chatMessagesQueryInputRevise(actInput.id, actInput.date, actInput.amount)
        expect(typeof chatid).toBe('string')
        expect(chatid).toEqual(actInput.id)
        expect(typeof date).toBe('object')
        expect(date.toISOString()).toMatch('2020-12-11T10:34:00.000Z')
        expect(typeof amount).toBe('object')
        expect(amount).toBe(null)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)
    })
    it('Proper input 3 - no amount value', ()=>{
        const actInput = inputs[3]
        const {error, field, issue, chatid, date, amount} =
            chatMessagesQueryInputRevise(actInput.id, actInput.date, actInput.amount)
        expect(typeof chatid).toBe('string')
        expect(chatid).toEqual(actInput.id)
        expect(typeof date).toBe('object')
        expect(date.toISOString()).toMatch('2020-12-11T10:34:00.000Z')
        expect(typeof amount).toBe('undefined')

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)
    })
    it('Proper input 4 - no date value', ()=>{
        const actInput = inputs[4]
        const {error, field, issue, chatid, date, amount} =
            chatMessagesQueryInputRevise(actInput.id, actInput.date, actInput.amount)
        expect(typeof chatid).toBe('string')
        expect(chatid).toEqual(actInput.id)
        expect(typeof date).toMatch('undefined')
        expect(typeof amount).toBe('number')
        expect(amount).toBe(2)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)
    })
    it('Proper input 5', ()=>{
        const actInput = inputs[5]
        const {error, field, issue, chatid, date, amount} =
            chatMessagesQueryInputRevise(actInput.id, actInput.date, actInput.amount)
        expect(typeof chatid).toBe('string')
        expect(chatid).toEqual(actInput.id)
        expect(typeof date).toMatch('undefined')
        expect(typeof amount).toBe('number')
        expect(amount).toBe(2)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)
    })
    it('Inproper inputs 6 - chatid', ()=>{
        const actInput = inputs[6]
        const {error, field, issue, chatid, date, amount} =
        chatMessagesQueryInputRevise(actInput.id, actInput.date, actInput.amount)

        expect(chatid).toBe(undefined)
        expect(date).toBe(undefined)
        expect(amount).toBe(undefined)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('chatid')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The chatid is not acceptable!')
    })
    it('Inproper inputs 7 - date format fail', ()=>{
        const actInput = inputs[7]
        const {error, field, issue, chatid, date, amount} =
        chatMessagesQueryInputRevise(actInput.id, actInput.date, actInput.amount)

        expect(chatid).toBe(undefined)
        expect(date).toBe(undefined)
        expect(amount).toBe(undefined)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('date')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The date is not acceptable!')
    })
    it('Inproper inputs 8', ()=>{
        const actInput = inputs[7]
        const {error, field, issue, chatid, date, amount} =
        chatMessagesQueryInputRevise(actInput.id, actInput.date, actInput.amount)

        expect(chatid).toBe(undefined)
        expect(date).toBe(undefined)
        expect(amount).toBe(undefined)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('date')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The date is not acceptable!')
    })
    it('Inproper inputs 9', ()=>{
        const actInput = inputs[9]
        const {error, field, issue, chatid, date, amount} =
        chatMessagesQueryInputRevise(actInput.id, actInput.date, actInput.amount)

        expect(chatid).toBe(undefined)
        expect(date).toBe(undefined)
        expect(amount).toBe(undefined)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('date')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The date is not acceptable!')
    })
    it('Inproper inputs 10', ()=>{
        const actInput = inputs[10]
        const {error, field, issue, chatid, date, amount} =
        chatMessagesQueryInputRevise(actInput.id, actInput.date, actInput.amount)

        expect(chatid).toBe(undefined)
        expect(date).toBe(undefined)
        expect(amount).toBe(undefined)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('date')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The date is not acceptable!')
    })
    it('Inproper inputs 11 - amount', ()=>{
        const actInput = inputs[11]
        const {error, field, issue, chatid, date, amount} =
        chatMessagesQueryInputRevise(actInput.id, actInput.date, actInput.amount)

        expect(chatid).toBe(undefined)
        expect(date).toBe(undefined)
        expect(amount).toBe(undefined)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('amount')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The amount is not acceptable!')
    })
    it('Inproper inputs 12', ()=>{
        const actInput = inputs[12]
        const {error, field, issue, chatid, date, amount} =
        chatMessagesQueryInputRevise(actInput.id, actInput.date, actInput.amount)

        expect(chatid).toBe(undefined)
        expect(date).toBe(undefined)
        expect(amount).toBe(undefined)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('amount')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The amount is not acceptable!')
    })
    it('Inproper inputs 13', ()=>{
        const actInput = inputs[13]
        const {error, field, issue, chatid, date, amount} =
        chatMessagesQueryInputRevise(actInput.id, actInput.date, actInput.amount)

        expect(chatid).toBe(undefined)
        expect(date).toBe(undefined)
        expect(amount).toBe(undefined)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('amount')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The amount is not acceptable!')
    })
    it('Inproper inputs 14 - all', ()=>{
        const actInput = inputs[14]
        const {error, field, issue, chatid, date, amount} =
        chatMessagesQueryInputRevise(actInput.id, actInput.date, actInput.amount)

        expect(chatid).toBe(undefined)
        expect(date).toBe(undefined)
        expect(amount).toBe(undefined)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(3)
        expect(field[0]).toBe('chatid')
        expect(field[1]).toBe('date')
        expect(field[2]).toBe('amount')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(3)
        expect(issue[0]).toBe('The chatid is not acceptable!')
        expect(issue[1]).toBe('The date is not acceptable!')
        expect(issue[2]).toBe('The amount is not acceptable!')
    })
    it('Inproper inputs 15', ()=>{
        const actInput = inputs[14]
        const {error, field, issue, chatid, date, amount} =
        chatMessagesQueryInputRevise(actInput.id, actInput.date, actInput.amount)

        expect(chatid).toBe(undefined)
        expect(date).toBe(undefined)
        expect(amount).toBe(undefined)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(3)
        expect(field[0]).toBe('chatid')
        expect(field[1]).toBe('date')
        expect(field[2]).toBe('amount')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(3)
        expect(issue[0]).toBe('The chatid is not acceptable!')
        expect(issue[1]).toBe('The date is not acceptable!')
        expect(issue[2]).toBe('The amount is not acceptable!')
    })
})


describe('Chatroom creation processes input revision tests', ()=>{
    const inputs = [
        { 
            partn: [ '0123456789abcdef01234567', 'abcdef0123456789abcdef01' ],
            title: 'Chatroom for studies', content: 'Study well people!'
        },
        {   //pointer 1 -> 3
            partn: [ '0123456789abcdef01234567', 'abcdef0123456789abcdkjkj' ],
            title: 'Chatroom for studies', content: 'Study well people!'
        },
        {
            partn: [ '0123456789abcdef01234567', 'abcdef0123456789abcd' ],
            title: 'Chatroom for studies', content: 'Study well people!'
        },
        {
            partn: [],
            title: 'Chatroom for studies', content: 'Study well people!'
        },
        {   //pointer 4
            partn: [ '0123456789abcdef01234567', 'abcdef0123456789abcdef01' ],
            title: '', content: 'Study well people!'
        },
        {   //pointer 5
            partn: [ '0123456789abcdef01234567', 'abcdef0123456789abcdef01' ],
            title: 'Chatroom for studies', content: ''
        },
        {   //pointer 6
            partn: [], title: '', content: null
        }
    ]

    it('Proper inputs for chat creation 0', ()=>{
        const actInput = inputs[0]
        const { error, field, issue, partners, title, content} = 
            chatRoomCreateInputRevise(actInput.partn, actInput.title, actInput.content)

        expect(typeof partners).toBe('object')
        expect(partners).toEqual(actInput.partn)
        expect(typeof title).toBe('string')
        expect(title).toMatch(actInput.title)
        expect(typeof content).toBe('string')
        expect(content).toMatch(actInput.content)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)
    })
    it('Inproper inputs for chat creation 1 - partners a', ()=>{
        const actInput = inputs[1]
        const { error, field, issue, partners, title, content} = 
            chatRoomCreateInputRevise(actInput.partn, actInput.title, actInput.content)

        expect(partners).toBe(undefined)
        expect(title).toBe(undefined)
        expect(content).toBe(undefined)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('partners')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The partners array have not proper friendid!')
    })
    it('Inproper inputs for chat creation 2', ()=>{
        const actInput = inputs[2]
        const { error, field, issue, partners, title, content} = 
            chatRoomCreateInputRevise(actInput.partn, actInput.title, actInput.content)

        expect(partners).toBe(undefined)
        expect(title).toBe(undefined)
        expect(content).toBe(undefined)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('partners')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The partners array have not proper friendid!')
    })
    it('Inproper inputs for chat creation 3 - partners b', ()=>{
        const actInput = inputs[3]
        const { error, field, issue, partners, title, content} = 
            chatRoomCreateInputRevise(actInput.partn, actInput.title, actInput.content)

        expect(partners).toBe(undefined)
        expect(title).toBe(undefined)
        expect(content).toBe(undefined)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('partners')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('No partners were passed!')
    })
    it('Inproper inputs for chat creation 4 - title', ()=>{
        const actInput = inputs[4]
        const { error, field, issue, partners, title, content} = 
            chatRoomCreateInputRevise(actInput.partn, actInput.title, actInput.content)

        expect(partners).toBe(undefined)
        expect(title).toBe(undefined)
        expect(content).toBe(undefined)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('title')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The title of chatroom is not acceptable!')
    })
    it('Inproper inputs for chat creation 5 - message', ()=>{
        const actInput = inputs[5]
        const { error, field, issue, partners, title, content} = 
            chatRoomCreateInputRevise(actInput.partn, actInput.title, actInput.content)

        expect(partners).toBe(undefined)
        expect(title).toBe(undefined)
        expect(content).toBe(undefined)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('message')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The message to the chatroom is not acceptable!')
    })
    it('Inproper inputs for chat creation 6 - all', ()=>{
        const actInput = inputs[6]
        const { error, field, issue, partners, title, content} = 
            chatRoomCreateInputRevise(actInput.partn, actInput.title, actInput.content)

        expect(partners).toBe(undefined)
        expect(title).toBe(undefined)
        expect(content).toBe(undefined)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(3)
        expect(field[0]).toBe('partners')
        expect(field[1]).toBe('title')
        expect(field[2]).toBe('message')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(3)
        expect(issue[0]).toBe('No partners were passed!')
        expect(issue[1]).toBe('The title of chatroom is not acceptable!')
        expect(issue[2]).toBe('The message to the chatroom is not acceptable!')
    })
})

describe('Chatroom parcipitatnt management input revison tests', ()=>{
    const inputs = [
        { 
            id: '01234abcdef56789abcdef01', 
            partn: [ '0123456789abcdef01234567', 'abcdef0123456789abcdef01' ] 
        },
        {  //pointer 1-2
            id: '01234abcdef56789', 
            partn: [ '0123456789abcdef01234567', 'abcdef0123456789abcdef01' ] 
        },
        { 
            id: '', 
            partn: [ '0123456789abcdef01234567', 'abcdef0123456789abcdef01' ] 
        },
        {   //pointer 3-4
            id: '01234abcdef56789abcdef01', 
            partn: [ '0123456789abcdef', 'abcdef0123456789abcdef01' ] 
        },
        { 
            id: '01234abcdef56789abcdef01', 
            partn: [ ] 
        },
        {   //pointer 5 
            id: null, 
            partn: null 
        }
    ]

    it('Proper inputs for partners changing 0', ()=>{
        const actInput = inputs[0]
        const { error, field, issue, chatid, partners } = 
            chatRoomAddRemovePartnersInputRevise(actInput.id, actInput.partn)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(typeof chatid).toBe('string')
        expect(chatid).toBe(actInput.id)
        expect(typeof partners).toBe('object')
        expect(partners).toEqual(actInput.partn)
    })
    it('Inproper inputs 1 - chatid', ()=>{
        const actInput = inputs[1]
        const { error, field, issue, chatid, partners } = 
            chatRoomAddRemovePartnersInputRevise(actInput.id, actInput.partn)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('chatid')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The chatid is not acceptable!')

        expect(chatid).toBe(undefined)
        expect(partners).toBe(undefined)
    })
    it('Inproper inputs 2', ()=>{
        const actInput = inputs[2]
        const { error, field, issue, chatid, partners } = 
            chatRoomAddRemovePartnersInputRevise(actInput.id, actInput.partn)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('chatid')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The chatid is not acceptable!')

        expect(chatid).toBe(undefined)
        expect(partners).toBe(undefined)
    })
    it('Inproper inputs 3 - partners a', ()=>{
        const actInput = inputs[3]
        const { error, field, issue, chatid, partners } = 
            chatRoomAddRemovePartnersInputRevise(actInput.id, actInput.partn)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('partners')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The partners array have not proper friendid!')

        expect(chatid).toBe(undefined)
        expect(partners).toBe(undefined)
    })
    it('Inproper inputs 4 - partners b', ()=>{
        const actInput = inputs[4]
        const { error, field, issue, chatid, partners } = 
            chatRoomAddRemovePartnersInputRevise(actInput.id, actInput.partn)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('partners')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The partners is not an array!')

        expect(chatid).toBe(undefined)
        expect(partners).toBe(undefined)
    })
    it('Inproper inputs 5 - all', ()=>{
        const actInput = inputs[5]
        const { error, field, issue, chatid, partners } = 
            chatRoomAddRemovePartnersInputRevise(actInput.id, actInput.partn)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(2)
        expect(field[0]).toBe('chatid')
        expect(field[1]).toBe('partners')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(2)
        expect(issue[0]).toBe('The chatid is not acceptable!')
        expect(issue[1]).toBe('The partners is not an array!')

        expect(chatid).toBe(undefined)
        expect(partners).toBe(undefined)
    })
})

describe('Chatroom update process revision tests', ()=>{
    const inputs = [
        { id: '0123456789abcdef01234567', title: 'Normal title' },
        { id: '0123456789abcdef', title: 'Normal title'  },
        { id: '', title: 'Normal title'  },
        { id: '0123456789abcdef01234567', title: null  },
        { id: '012345', title: null  }
    ]


    it('Proper input 0', ()=>{
        const actInput = inputs[0]
        const { error, issue, field, chatid, title } = chatRoomUpdateInputRevise(
            actInput.id, actInput.title
        )

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)

        expect(typeof chatid).toBe('string')
        expect(chatid).toBe(actInput.id)
        expect(typeof title).toBe('string')
        expect(title).toBe(actInput.title)
    })
    it('Inproper input 1 - chatid', ()=>{
        const actInput = inputs[1]
        const { error, issue, field, chatid, title } = chatRoomUpdateInputRevise(
            actInput.id, actInput.title
        )

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('chatid')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The chatid is not acceptable!')

        expect(chatid).toBe(undefined)
        expect(title).toBe(undefined)
    })

    it('Inproper input 2', ()=>{
        const actInput = inputs[2]
        const { error, issue, field, chatid, title } = chatRoomUpdateInputRevise(
            actInput.id, actInput.title
        )

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('chatid')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The chatid is not acceptable!')

        expect(chatid).toBe(undefined)
        expect(title).toBe(undefined)
    })
    it('Inproper input 3 - titel', ()=>{
        const actInput = inputs[3]
        const { error, issue, field, chatid, title } = chatRoomUpdateInputRevise(
            actInput.id, actInput.title
        )

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('title')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The title of chatroom is not acceptable!')

        expect(chatid).toBe(undefined)
        expect(title).toBe(undefined)
    })

    it('Inproper input 5 - all', ()=>{
        const actInput = inputs[4]
        const { error, issue, field, chatid, title } = chatRoomUpdateInputRevise(
            actInput.id, actInput.title
        )

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(2)
        expect(field[0]).toBe('chatid')
        expect(field[1]).toBe('title')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(2)
        expect(issue[0]).toBe('The chatid is not acceptable!')
        expect(issue[1]).toBe('The title of chatroom is not acceptable!')

        expect(chatid).toBe(undefined)
        expect(title).toBe(undefined)
    })
})

describe('Chatroom deletion processes revision test', ()=>{
    const inputs = [ 
        '0123456789abcdef01234567', '012345', '', null
    ]

    it('Proper input 0', ()=>{
        const { error, field, issue, chatid } = chatRoomDelteInputRevise(inputs[0])

        expect(typeof chatid).toBe('string')
        expect(chatid).toBe(inputs[0])

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)
    })

    it('Inproper input 1', ()=>{
        const { error, field, issue, chatid } = chatRoomDelteInputRevise(inputs[1])

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('chatid')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The chatid is not acceptable!')

        expect(chatid).toBe(undefined)
    })

    it('Inproper input 2', ()=>{
        const { error, field, issue, chatid } = chatRoomDelteInputRevise(inputs[2])

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('chatid')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The chatid is not acceptable!')

        expect(chatid).toBe(undefined)
    })
    it('Inproper input 3', ()=>{
        const { error, field, issue, chatid } = chatRoomDelteInputRevise(inputs[3])

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('chatid')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The chatid is not acceptable!')

        expect(chatid).toBe(undefined)
    })
})

describe('Message sending input revision tests', ()=>{
    const inputs = [
        { id: '0123456789abcdef01234567', cont: 'Some content'},
        { id: '0123456789a', cont: 'Some content'}, //1->2
        { id: '', cont: 'Some content'},
        { id: '0123456789abcdef01234567', cont: ''},   //3-4
        { id: '0123456789abcdef01234567', cont: null},
        { id: '012', cont: null}
    ]
    it('Proper input 0', ()=>{
        const actInput = inputs[0]
        const { error, field, issue, chatid, message } = sendMessageInputRevise(
            actInput.id, actInput.cont)

        expect(typeof chatid).toBe('string')
        expect(chatid).toBe(actInput.id)
        expect(typeof message).toBe('string')
        expect(message).toBe(actInput.cont)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)
    })

    it('Inproper input 1 - chatid', ()=>{
        const actInput = inputs[1]
        const { error, field, issue, chatid, message } = sendMessageInputRevise(
            actInput.id, actInput.cont)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('chatid')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The chatid is not acceptable!')

        expect(chatid).toBe(undefined)
        expect(message).toBe(undefined)
    })
    it('Inproper input 2', ()=>{
        const actInput = inputs[2]
        const { error, field, issue, chatid, message } = sendMessageInputRevise(
            actInput.id, actInput.cont)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('chatid')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The chatid is not acceptable!')

        expect(chatid).toBe(undefined)
        expect(message).toBe(undefined)
    })
    it('Inproper input 3 - message', ()=>{
        const actInput = inputs[3]
        const { error, field, issue, chatid, message } = sendMessageInputRevise(
            actInput.id, actInput.cont)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('message')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The message to the chatroom is not acceptable!')

        expect(chatid).toBe(undefined)
        expect(message).toBe(undefined)
    })
    it('Inproper input 4', ()=>{
        const actInput = inputs[4]
        const { error, field, issue, chatid, message } = sendMessageInputRevise(
            actInput.id, actInput.cont)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('message')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The message to the chatroom is not acceptable!')

        expect(chatid).toBe(undefined)
        expect(message).toBe(undefined)
    })
    it('Inproper input 5 - all', ()=>{
        const actInput = inputs[5]
        const { error, field, issue, chatid, message } = sendMessageInputRevise(
            actInput.id, actInput.cont)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(2)
        expect(field[0]).toBe('chatid')
        expect(field[1]).toBe('message')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(2)
        expect(issue[0]).toBe('The chatid is not acceptable!')
        expect(issue[1]).toBe('The message to the chatroom is not acceptable!')

        expect(chatid).toBe(undefined)
        expect(message).toBe(undefined)
    })

})
describe('Message updating input revision tests', ()=>{

    const inputs = [
        { 
            msg: 'abcdef0123456789abcdef01', cont: 'A message' 
        },
        { 
            msg: 'abcdef012', cont: 'A message' 
        },
        { 
            msg: 'abcdef0123456789abcdef01', cont: '' 
        },
        { 
            msg: '', cont: '' 
        }
    ]
    it('Proper input 0', ()=>{
        const actInput = inputs[0]
        const { error, field, issue, messageid, message } = 
            updateMessageInputRvise( actInput.msg, actInput.cont)

        expect(typeof messageid).toBe('string')
        expect(messageid).toBe(actInput.msg)
        expect(typeof message).toBe('string')
        expect(message).toBe(actInput.cont)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)
    })
    it('Inproper input 1 - messageid', ()=>{
        const actInput = inputs[1]
        const { error, field, issue, messageid, message } = 
            updateMessageInputRvise( actInput.msg, actInput.cont)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('messageid')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The messageid is not acceptable!')

        expect(messageid).toBe(undefined)
        expect(message).toBe(undefined)
    })
    it('Inproper input 2 - message', ()=>{
        const actInput = inputs[2]
        const { error, field, issue, messageid, message } = 
            updateMessageInputRvise( actInput.msg, actInput.cont)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('message')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The message to the chatroom is not acceptable!')

        expect(messageid).toBe(undefined)
        expect(message).toBe(undefined)
    })
    it('Inproper input 3 - all', ()=>{
        const actInput = inputs[3]
        const { error, field, issue,  messageid, message } = 
            updateMessageInputRvise( actInput.msg, actInput.cont)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(2)
        expect(field[0]).toBe('messageid')
        expect(field[1]).toBe('message')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(2)
        expect(issue[0]).toBe('The messageid is not acceptable!')
        expect(issue[1]).toBe('The message to the chatroom is not acceptable!')

        expect(messageid).toBe(undefined)
        expect(message).toBe(undefined)
    })
})
describe('Message deletion input revision tests', ()=>{
    const inputs = [
        '012345678901234567abcdef', '0123456', null
    ]

    it('Proper ingputs 0', ()=>{
        const { error, field, issue, messageid } = deleteMessageInputRevise(
            inputs[0])
    
        expect(typeof messageid).toBe('string')
        expect(messageid).toBe(inputs[0])

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)
    })
    it('Inproper ingputs 1', ()=>{
        const { error, field, issue, messageid } = deleteMessageInputRevise(
            inputs[1])

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('messageid')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The messageid is not acceptable!')

        expect(messageid).toBe(undefined)
    })
    it('Inproper ingputs 2', ()=>{
        const { error, field, issue, messageid } = deleteMessageInputRevise(
            inputs[2])

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('messageid')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The messageid is not acceptable!')

        expect(messageid).toBe(undefined)
    })
})