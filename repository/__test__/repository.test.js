const mongoose = require('mongoose')
const { InMemoryLRUCache } = require('apollo-server-caching')
const DocType = require('mongoose').Document

const url = require('../../config/dbConfig').dbLocal
const ProfileModel = require('../../models/ProfileModel')
const PostModel = require('../../models/PostModel')
const CommentModel = require('../../models/CommentModel')
const ParentDs = require('../generalDataSource')
const ProfDs = require('../profileDS')
const PostDs = require('../postDS')
const CommDs = require('../commentDS')

//it uses the seeded datas as testdata!!!

let docProfiles = []
let docPosts = []
let docComments = null
beforeAll((done)=>{
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    ProfileModel.find({}, async (err, docs)=>{
        expect(err).toBe(null)
        docProfiles = docs

        PostModel.find({}, async (e, d)=>{
            expect(e).toBe(null)
            docPosts = d

            CommentModel.find({}, (ex, dc)=>{
                expect(ex).toBe(null)
                docComments = dc
                done()
            })
        })
    })
    
})
afterAll(()=>{
    mongoose.disconnect()
    
})


describe('Parent DataSource positive tests', ()=>{

    it('Testing the parent', async ()=>{

        const targetIdStr = docProfiles[1]._id.toString()

        const dsParent = new ParentDs(ProfileModel)
        dsParent.initialize({ context: 'stg' });
        const doc = await dsParent.get(targetIdStr, { ttlInSeconds: 3 } )
        expect(doc._id.toString()).toStrictEqual(targetIdStr)

        
    })
    it('Testing the parent with cashing, string id maintained', async ()=>{

        const targetIdStr = docProfiles[1]._id.toString()

        const dsParent = new ParentDs(ProfileModel)
        dsParent.initialize({ context: 'stg' });
        const doc1 = await dsParent.get(targetIdStr, { ttlInSeconds: 3 } )
        expect(doc1._id.toString()).toStrictEqual(targetIdStr)

        const doc2 = await dsParent.get(targetIdStr, { ttlInSeconds: 3 } )
        expect(doc2._id.toString()).toStrictEqual(targetIdStr)
    
    })
    it('Testing the parent with cashing, ObjectId maintained', async ()=>{

            const targetIdObj = docProfiles[1]._id
    
            const dsParent = new ParentDs(ProfileModel)
            dsParent.initialize({ context: 'stg' });
            const doc1 = await dsParent.get(targetIdObj, { ttlInSeconds: 3 } )
            expect(doc1._id.toString()).toStrictEqual(targetIdObj.toString())

            const doc2 = await dsParent.get(targetIdObj, { ttlInSeconds: 3 } )
            expect(doc2._id.toString()).toStrictEqual(targetIdObj.toString())

    })
    it('Parent saving the loaded doc and creation a newone', async ()=>{

        const targetIdObj = docProfiles[1]._id

        const dsParent = new ParentDs(ProfileModel)
        dsParent.initialize({ context: 'stg' });
        
        const doc1 = await dsParent.get(targetIdObj, { ttlInSeconds: 3 } )
        expect(doc1._id.toString()).toStrictEqual(targetIdObj.toString())

        doc1.username = 'Testing Name'
        dsParent.saving(doc1)

        const doc2 = await dsParent.create({
            email: 'notproper',
            username: 'nottointerfare',
            registredAt: null,
            pwdHash: 'notgoodpwd',
        })

        return ProfileModel.findOne({_id: targetIdObj}, (error, doc)=>{
            expect(error).toBe(null)
            expect(doc.username).toBe('Testing Name')

            return ProfileModel.findOne({_id: doc2._id}, (e,d)=>{
                expect(e).toBe(null)
                expect(d.email).toBe('notproper')

                return ProfileModel.deleteOne({_id: doc2._id}, (ex, rep)=>{
                    expect(ex).toBe(null)
                })
            })
        })

        
    })
    
    it('Test parent many process at once, global ttl', async ()=>{
        //jest.useFakeTimers()
        const metrics = []

        const dsParent = new ParentDs(ProfileModel, { ttlInSeconds: 3 })
        dsParent.initialize({ context: 'stg' });

        metrics.push(new Date().getTime() + ' start point')
        const doc4 = await dsParent.get(docProfiles[4]._id )
        metrics.push(new Date().getTime() + ' doc4 loaded')
        const doc2 = await dsParent.get(docProfiles[2]._id )
        metrics.push(new Date().getTime() + ' doc2 loaded')
        const doc0 = await dsParent.get(docProfiles[0]._id )
        metrics.push(new Date().getTime() + ' doc0 loaded')

        setTimeout(async ()=>{
            metrics.push(new Date().getTime() + ' break 1s, doc4 reload')
            const doc4re = await dsParent.get(docProfiles[4]._id )
            metrics.push(new Date().getTime() + ' the doc4 loaded')

            setTimeout(async ()=>{
                metrics.push(new Date().getTime() + ' break 3s, doc4 reload')
                const doc4again = await dsParent.get(docProfiles[4]._id )
                metrics.push(new Date().getTime() + ' the doc4 loaded again')

                doc4again.email = 'stgnew@easymail.com'
                await dsParent.saving(doc4again)
                metrics.push(new Date().getTime() + ' doc4 update, reload start')
                const doc4upd = await dsParent.get(docProfiles[4]._id )
                metrics.push(new Date().getTime() + ' doc4 update loaded')

                expect(doc4upd.email).toBe(doc4again.email)

                console.log(metrics)
                //jest.runOnlyPendingTimers()
                //jest.useRealTimers()
            }, 3000)
        }, 1000)
        
    }, 6000)


    it('Parent getAll method test, mixed ids', async ()=>{
        

        const dsParent = new ParentDs(ProfileModel, { ttlInSeconds: 3 })
        dsParent.initialize({ context: 'stg' });
        
        const ids = [ docProfiles[3]._id, docProfiles[0]._id.toString(), docProfiles[4]._id ]
        const docArr = await dsParent.getAllOfThese(ids)
        expect(docArr).toHaveLength(3)
        expect(docArr[0]).toStrictEqual(docProfiles[3])
        expect(docArr[1]).toStrictEqual(docProfiles[0])
        expect(docArr[2]).toStrictEqual(docProfiles[4])
    })

    it('Parent deleting method test', async ()=>{

        const userRemoving = docProfiles[5]
        const userToRecreate = {...docProfiles[5] }
        const dsParent = new ParentDs(ProfileModel, { ttlInSeconds: 3 })
        dsParent.initialize({ context: 'stg' });

        await dsParent.deleting(userRemoving._id)


        return ProfileModel.findOne({_id: userRemoving._id}, (err, doc)=>{
            expect(err).toBe(null)
            expect(doc).toBe(null)

            return ProfileModel.create(userToRecreate, (e, r)=>{
                expect(e).toBe(null)
            })
        })


    }, 6000)
})

describe('Parent Datasource negative tests', ()=>{
    it('Create without content', async()=>{
        try{
            const dsParent = new ParentDs(ProfileModel)
            dsParent.initialize({ context: 'stg' });

            const res = await dsParent.create()
        }catch(err){
            expect(err).toBeInstanceOf(Error)
            expect(err.message).toBe('Not proper doc parts were passed!')
        }
    })
    it('Create with empty object content', async()=>{
        try{
            const dsParent = new ParentDs(ProfileModel)
            dsParent.initialize({ context: 'stg' });

            const res = await dsParent.create({})
        }catch(err){
            expect(err).toBeInstanceOf(Error)
            expect(err.message).toBe('Not proper doc parts were passed!')
        }
    })
    it('Saving not proper doc object', async ()=>{
        try{
            const dsParent = new ParentDs(ProfileModel)
            dsParent.initialize({ context: 'stg' });

            const res = await dsParent.saving({})
        }catch(err){
            expect(err).toBeInstanceOf(Error)
            expect(err.message).toBe('Not proper DocObj was passed!')
        }
    })
    it('Seeking with not proper doc objectid', async ()=>{
        try{
            const dsParent = new ParentDs(ProfileModel)
            dsParent.initialize({ context: 'stg' });

            const res = await dsParent.get('01234')
        }catch(err){
            expect(err).toBeInstanceOf(Error)
            expect(err.message).toBe('Not DocId was passed!')
        }
    })
    
    it('Seeking several doc without proper ids in array', async ()=>{
        try{
            const dsParent = new ParentDs(ProfileModel)
            dsParent.initialize({ context: 'stg' });

            const res = await dsParent.getAllOfThese(['0123', 'abc'])
        }catch(err){
            expect(err).toBeInstanceOf(Error)
            expect(err.message).toBe('Not DocId was passed!')
        }
    })
    
    it('Seeking several doc without proper array of ids', async ()=>{
        try{
            const dsParent = new ParentDs(ProfileModel)
            dsParent.initialize({ context: 'stg' });

            const res = await dsParent.getAllOfThese({id1: '0123', id2: 'abc'})
        }catch(err){
            expect(err).toBeInstanceOf(Error)
            expect(err.message).toBe('Not DocId was passed!')
        }
    })
    it('Seeking several doc without passing array', async ()=>{
        try{
            const dsParent = new ParentDs(ProfileModel)
            dsParent.initialize({ context: 'stg' });

            const res = await dsParent.getAllOfThese()
        }catch(err){
            expect(err).toBeInstanceOf(Error)
            expect(err.message).toBe('Not DocId was passed!')
        }
    })
})

describe('Specialised DataSource testing', ()=>{
    it('Simple profile processes - get method with ID and email as well', async ()=>{

        const dsProf = new ProfDs()
        dsProf.initialize({ context: 'stg' });

        const targetIdObj = docProfiles[0]._id
        const res1 = await dsProf.get(targetIdObj)
        expect(res1).toBeInstanceOf(DocType)
        expect(res1._id).toStrictEqual(targetIdObj)
        
        const targetEmailStr = docProfiles[0].email
        const res2 = await dsProf.get(targetEmailStr)
        expect(res2).toBeInstanceOf(DocType)
        expect(res2._id).toStrictEqual(targetIdObj)

        const targetIdStr = docProfiles[0]._id.toString()
        const res3 = await dsProf.get(targetIdStr)
        expect(res3).toBeInstanceOf(DocType)
        expect(res3._id).toStrictEqual(targetIdObj)
    })

    it('Simple post processes - get by postId, get by owner', async ()=>{

        const dsPost = new PostDs()
        dsPost.initialize({ context: 'stg' })

        const postIdStr = docPosts[1]._id.toString()
        const res1 = await dsPost.get(postIdStr)
        expect(res1).toBeInstanceOf(DocType)
        expect(res1._id.toString()).toEqual(postIdStr)

    })

    it('Simple post processes - getAll by postIds, getAll by owners', async ()=>{
        const dsPost = new PostDs()
        dsPost.initialize({ context: 'stg' })

        // user3 has 2 post, user4 has none
        const manageTheseUsers = [ docProfiles[3], docProfiles[4]]
        const idsOfAllUser = manageTheseUsers.map(item=>{ return item._id })
        const manageTheseDocs = [ docPosts[1], docPosts[6]] //all from user3
        const idsOfAllPost = manageTheseDocs.map(item =>{ return item._id })

        const res1 = await dsPost.getAllOfThese(idsOfAllPost)
        expect(res1).toBeInstanceOf(Array)
        expect(res1).toHaveLength(2)
        expect(res1[0].owner).toStrictEqual(docProfiles[3]._id)
        expect(res1[0].owner).toStrictEqual(res1[1].owner)
    })

    it('Simple post processes - deletAllOfThese', async ()=>{

        const dsPost = new PostDs()
        dsPost.initialize({ context: 'stg' })

        const postsToRegenerate = [ docPosts[7], docPosts[8]] //from user5, user9
        const idsOfAll = postsToRegenerate.map(item=>{return item._id})
        await dsPost.deletingAllOfThese(idsOfAll)
 
        return PostModel.find({_id: idsOfAll}, (err, res)=>{
            expect(err).toBe(null)
            expect(res).toBeInstanceOf(Array)
            expect(res).toHaveLength(0)
            
            return PostModel.insertMany(postsToRegenerate, (e, r)=>{
                expect(e).toBe(null)
                expect(r).toHaveLength(2)
                console.log('Post reinsertion done')
            })
        })
 
    })

    it('Simple post processes - seek by dedication', async ()=>{
        const dsPost = new PostDs()
        dsPost.initialize({ context: 'stg' })

        //user0 has from user3 and user 7 has from user1 post - dedicated to them
        const user0Id = docProfiles[0]._id
        const senderId = docProfiles[3]._id
        const res = await dsPost.getByDedication(user0Id)
        expect(res).toBeInstanceOf(Array)
        expect(res).toHaveLength(1)
        expect(res[0].owner).toStrictEqual(senderId)
        expect(res[0].dedicatedTo).toStrictEqual(user0Id)
    })


    it('Special recursive comment deletion', (done)=>{
        //RESEED THE DB OR IT GO MAD !!!
        CommentModel.find({}, async (e1, d1)=>{
            expect(e1).toBe(null)
            expect(d1).not.toBe(null)
            const originAmount = d1.length

            const dsComm = new CommDs()
            dsComm.initialize({ context: 'stg' })

            const commentToDel = [ docComments[6]._id ]
            const commToReinsert = []
            for(let i = 6; i < 10; i++){
                commToReinsert.push(docComments[i])
            }
            try{
                await dsComm.recursiveRemovalOfThese(commentToDel)
            }catch(err){
                expect(err).toBe(null)
            }
            
            return CommentModel.find({}, (e2, d2)=>{
                expect(e2).toBe(null)
                expect(d2.length + 4).toBe(originAmount)

                return CommentModel.insertMany(commToReinsert,(ex, re)=>{
                    expect(ex).toBe(null)
                    expect(re).not.toBe(null)

                    expect(re.length).toBe(4)
                    done()
                })
            })
        })
    })
})