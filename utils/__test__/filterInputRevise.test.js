const { postOrCommentFilteringInputRevise } = require('../inputRevise')

describe('Filtering input testing', ()=>{
    const inputs = [
        { date: '2020-12-11T10:34:00.000Z', amount: 2 },
        { date: null, amount: 3 },
        { date: '2020-12-11T10:34:00.000Z', amount: null },
        { amount: null },

        //pointer 4
        { date: '2020-12-11T10:34:00.000Z', amount: -3 },
        { date: '2020-12-11T10:34:00.000Z', amount: 333 },
        { date: '2020-12-11T10:34:00.000', amount: 2 },
        { date: '2020-12-11.000Z', amount: 3 },
        { date: '04 May 2020 12:33 UTC', amount: 3 },
        { date: 2012, amount: 10 },

        //pointer 10
        { date: '2020-12-11.000Z', amount: -1 },
    ]

    it('Proper input 0', ()=>{
        const actInput = inputs[0]
        const { error, issue, field, date, amount} = 
            postOrCommentFilteringInputRevise(actInput.date, actInput.amount)
        
        expect(error).toBe(undefined)
        expect(issue).toBe(undefined)
        expect(field).toBe(undefined)
        
        expect(typeof date).toBe('object')
        expect(date).toEqual(new Date(actInput.date))
        expect(typeof amount).toBe('number')
        expect(amount).toBe(actInput.amount)
    })
    it('Proper input 1', ()=>{
        const actInput = inputs[1]
        const { error, issue, field, date, amount} = 
            postOrCommentFilteringInputRevise(actInput.date, actInput.amount)
        
        expect(error).toBe(undefined)
        expect(issue).toBe(undefined)
        expect(field).toBe(undefined)
        
        expect(typeof date).toBe('undefined')
        expect(typeof amount).toBe('number')
        expect(amount).toBe(actInput.amount)
    })
    it('Proper input 2', ()=>{
        const actInput = inputs[2]
        const { error, issue, field, date, amount} = 
            postOrCommentFilteringInputRevise(actInput.date, actInput.amount)
        
        expect(error).toBe(undefined)
        expect(issue).toBe(undefined)
        expect(field).toBe(undefined)

        expect(typeof date).toBe('object')
        expect(date).toEqual(new Date(actInput.date))
        expect(typeof amount).toBe('object')
        expect(amount).toBe(null)
    })
    it('Proper input 3', ()=>{
        const actInput = inputs[3]
        const { error, issue, field, date, amount} = 
            postOrCommentFilteringInputRevise(actInput.date, actInput.amount)
        
        expect(error).toBe(undefined)
        expect(issue).toBe(undefined)
        expect(field).toBe(undefined)
        
        expect(typeof date).toBe('undefined')
        expect(typeof amount).toBe('object')
        expect(amount).toBe(null)
    })

    it('Inproper input 4 - amount', ()=>{
        const actInput = inputs[4]
        const { error, issue, field, date, amount} = 
            postOrCommentFilteringInputRevise(actInput.date, actInput.amount)
        
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('amount')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The amount is not acceptable!')

        expect(date).toBe(undefined)
        expect(amount).toBe(undefined)
    })
    it('Inproper input 5', ()=>{
        const actInput = inputs[5]
        const { error, issue, field, date, amount} = 
            postOrCommentFilteringInputRevise(actInput.date, actInput.amount)
        
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('amount')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The amount is not acceptable!')

        expect(date).toBe(undefined)
        expect(amount).toBe(undefined)
    })
    it('Inproper input 6 - date', ()=>{
        const actInput = inputs[6]
        const { error, issue, field, date, amount} = 
            postOrCommentFilteringInputRevise(actInput.date, actInput.amount)
        
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('date')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The date is not acceptable!')

        expect(date).toBe(undefined)
        expect(amount).toBe(undefined)
    })
    it('Inproper input 7', ()=>{
        const actInput = inputs[7]
        const { error, issue, field, date, amount} = 
            postOrCommentFilteringInputRevise(actInput.date, actInput.amount)
        
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('date')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The date is not acceptable!')

        expect(date).toBe(undefined)
        expect(amount).toBe(undefined)
    })
    it('Inproper input 8', ()=>{
        const actInput = inputs[8]
        const { error, issue, field, date, amount} = 
            postOrCommentFilteringInputRevise(actInput.date, actInput.amount)
        
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('date')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The date is not acceptable!')

        expect(date).toBe(undefined)
        expect(amount).toBe(undefined)
    })
    it('Inproper input 9', ()=>{
        const actInput = inputs[9]
        const { error, issue, field, date, amount} = 
            postOrCommentFilteringInputRevise(actInput.date, actInput.amount)
        
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(1)
        expect(field[0]).toBe('date')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(1)
        expect(issue[0]).toBe('The date is not acceptable!')

        expect(date).toBe(undefined)
        expect(amount).toBe(undefined)
    })
    it('Inproper input 10', ()=>{
        const actInput = inputs[10]
        const { error, issue, field, date, amount} = 
            postOrCommentFilteringInputRevise(actInput.date, actInput.amount)
        
        expect(error).toBeTruthy()
        expect(typeof field).toBe('object')
        expect(field).toHaveLength(2)
        expect(field[0]).toBe('date')
        expect(field[1]).toBe('amount')
        expect(typeof issue).toBe('object')
        expect(issue).toHaveLength(2)
        expect(issue[0]).toBe('The date is not acceptable!')
        expect(issue[1]).toBe('The amount is not acceptable!')

        expect(date).toBe(undefined)
        expect(amount).toBe(undefined)
    })
})