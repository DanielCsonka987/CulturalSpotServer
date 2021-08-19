const { isThisUndefined, isThisAnEmptyArray,
    isThisAnArray, isThisProperDocID, isThisProperDocObj,
    isThisProperForDocParts, isItRealEmail
} = require('../dataSourceHelpers')

const mongooseId = require('mongoose').Types.ObjectId

describe('Helper input revisors test', ()=>{
    it('Undefined checking', ()=>{
        expect(isThisUndefined(undefined)).toBeTruthy()
        expect(isThisUndefined('')).toBeFalsy()
        expect(isThisUndefined([])).toBeFalsy()
        expect(isThisUndefined({})).toBeFalsy()
        expect(isThisUndefined({ id: '1' })).toBeFalsy()
    })

    it('Array emtyness checking', ()=>{
        expect(isThisAnEmptyArray([])).toBeTruthy()
        expect(isThisAnEmptyArray(['content'])).toBeFalsy()
        expect(isThisAnEmptyArray([ {id: '1'}, { id: '2' } ])).toBeFalsy()
    })

    it('Array checking', ()=>{
        expect(isThisAnArray([])).toBeTruthy()
        expect(isThisAnArray({})).toBeFalsy()
        expect(isThisAnArray('Stg')).toBeFalsy()
        expect(isThisAnArray(undefined)).toBeFalsy()
    })
    it('Mongoose DocID checking', ()=>{
        expect(isThisProperDocID( new mongooseId() )).toBeTruthy()
        expect(isThisProperDocID( { id: '123'} )).toBeFalsy()
        expect(isThisProperDocID( ['012'] )).toBeFalsy()
        expect(isThisProperDocID( '012' )).toBeFalsy()
    })
    it('DocObject checking', ()=>{

        expect(isThisProperDocObj( { name: 'me'} )).toBeFalsy()
        expect(isThisProperDocObj( [ 'me' ] )).toBeFalsy()
    })
    it('DocObject parts checking', ()=>{
        expect(isThisProperForDocParts( { id: '123' } )).toBeTruthy()
        expect(isThisProperForDocParts( '123' )).toBeFalsy()
        expect(isThisProperForDocParts( ['123'] )).toBeFalsy()
    })
    it('Email address checking', ()=>{
        expect(isItRealEmail('example@gmail.com')).toBeTruthy()
        expect(isItRealEmail('examplecom')).toBeFalsy()
        expect(isItRealEmail('')).toBeFalsy()
        expect(isItRealEmail(null)).toBeFalsy()
        expect(isItRealEmail( ['example@gmail.com'] )).toBeFalsy()
    })
})