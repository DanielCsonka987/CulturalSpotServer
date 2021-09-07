const { chatRoomCreateInputRevise, 
    chatRoomAddRemovePartnersInputRevise, chatRoomUpdateInputRevise,
    chatRoomDelteInputRevise, sendMessageInputRevise,
    updateMessageInputRvise, deleteMessageInputRevise
    } = require('../inputRevise')

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
            chat: '0123456789abcdef01234567', 
            msg: 'abcdef0123456789abcdef01', cont: 'A message' 
        },
        { 
            chat: '0123456789ab', 
            msg: 'abcdef0123456789abcdef01', cont: 'A message' 
        },
        { 
            chat: '0123456789abcdef01234567', 
            msg: 'abcdef012', cont: 'A message' 
        },
        { 
            chat: '0123456789abcdef01234567', 
            msg: 'abcdef0123456789abcdef01', cont: '' 
        },
        { 
            chat: '0123456789abcd', 
            msg: '', cont: '' 
        }
    ]
    it('Proper input 0', ()=>{
        const actInput = inputs[0]
        const { error, field, issue, chatid, messageid, message } = 
            updateMessageInputRvise( actInput.chat, actInput.msg, actInput.cont)

        expect(typeof chatid).toBe('string')
        expect(chatid).toBe(actInput.chat)
        expect(typeof messageid).toBe('string')
        expect(messageid).toBe(actInput.msg)
        expect(typeof message).toBe('string')
        expect(message).toBe(actInput.cont)

        expect(error).toBe(undefined)
        expect(field).toBe(undefined)
        expect(issue).toBe(undefined)
    })
    it('Inproper input 1 - chatid', ()=>{
        const actInput = inputs[1]
        const { error, field, issue, chatid, messageid, message } = 
            updateMessageInputRvise( actInput.chat, actInput.msg, actInput.cont)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('chatid')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The chatid is not acceptable!')

        expect(chatid).toBe(undefined)
        expect(messageid).toBe(undefined)
        expect(message).toBe(undefined)
    })
    it('Inproper input 2 - messageid', ()=>{
        const actInput = inputs[2]
        const { error, field, issue, chatid, messageid, message } = 
            updateMessageInputRvise( actInput.chat, actInput.msg, actInput.cont)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('messageid')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The messageid is not acceptable!')

        expect(chatid).toBe(undefined)
        expect(messageid).toBe(undefined)
        expect(message).toBe(undefined)
    })
    it('Inproper input 3 - message', ()=>{
        const actInput = inputs[3]
        const { error, field, issue, chatid, messageid, message } = 
            updateMessageInputRvise( actInput.chat, actInput.msg, actInput.cont)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('message')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The message to the chatroom is not acceptable!')

        expect(chatid).toBe(undefined)
        expect(messageid).toBe(undefined)
        expect(message).toBe(undefined)
    })
    it('Inproper input 4 - all', ()=>{
        const actInput = inputs[4]
        const { error, field, issue, chatid, messageid, message } = 
            updateMessageInputRvise( actInput.chat, actInput.msg, actInput.cont)

        expect(typeof error).toBe('boolean')
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(3)
        expect(field[0]).toBe('chatid')
        expect(field[1]).toBe('messageid')
        expect(field[2]).toBe('message')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(3)
        expect(issue[0]).toBe('The chatid is not acceptable!')
        expect(issue[1]).toBe('The messageid is not acceptable!')
        expect(issue[2]).toBe('The message to the chatroom is not acceptable!')

        expect(chatid).toBe(undefined)
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