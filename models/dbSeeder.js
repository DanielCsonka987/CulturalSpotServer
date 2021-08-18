const mongoose = require('mongoose')
const ProfileModel = require('./ProfileModel')
const PostModel = require('./PostModel')
const CommentModel = require('./CommentModel')
const ChattingModel = require('./ChattingModel')
const EmailReportModel = require('./EmailReportModel')

const { dbLocal, dbCloud } = require('../config/dbConfig')
const { profiles, posts, comments, messages } = require('./testdatasToDB')


const seedingProcess = new Promise((resolve, reject)=>{
    mongoose.connection.on('connected', ()=>{
        console.log(`DB connection established to ${process.argv[2]} store!`)
    }).on('error', (err)=>{
        console.log('DB error occured! ' + err)
    }).once('close', ()=>{
        console.log('DB connection closed!')
    })
    resolve()
}).then(()=>{
    if(process.argv[2] === 'local'){
        mongoose.connect(dbLocal, {useNewUrlParser: true, useUnifiedTopology: true})
    }
    if(process.argv[2] === 'cloud'){
        mongoose.connect(dbCloud, {useNewUrlParser: true, useUnifiedTopology: true})
    }
}).then(()=>{
    //manage profiles collection
    mongoose.connection.collections.profiles.drop(err=>{
        //error code 26 = NameSpaceNotFound => collection were already empty
        if(err) {  
            if(err.code !== 26) { 
                console.log('Profiles collection removal failed! ' + err)
                return;
            }
        }
        ProfileModel.insertMany(profiles, (error, report)=>{
            if(error) { console.log('Profiles collection filling up failed!') }
            if(report.length !== profiles.length) { console.log('Profiles collection misses some document!') }
            console.log('Profiles seeding done!')
        })
        
    })
}).then(()=>{
    //manage posts collection
    mongoose.connection.collections.posts.drop(err=>{
        if(err) {  
            if(err.code !== 26) { 
                console.log('Posts collection removal failed! ' + err)
                return;
            }
        }
        PostModel.insertMany(posts, (error, report)=>{
            if(error) { console.log('Posts collection filling up failed!') }
            if(report.length !== posts.length) { console.log('Posts collection misses some document!') }
            console.log('Posts seeding done!')
        })
        
    })
}).then(()=>{
    //manage coments collection
    mongoose.connection.collections.comments.drop(err=>{
        if(err) {
            if(err.code !== 26) { 
                console.log('Comments collection removal failed! ' + err)
                return
            }
        }
        CommentModel.insertMany(comments, (error, report)=>{
            if(error) { console.log('Comments collection filling up failed!') }
            if(report.length !== comments.length) { console.log('Comments collection misses some document!') }
            console.log('Comments seeding done!')
        })
        
    })
}).then(()=>{
    //manage chatting collection
    mongoose.connection.collections.chattings.drop(err=>{
        if(err) {  
            if(err.code !== 26) { 
                console.log('Messages collection removal failed! ' + err) 
                return;
            }
        }
        ChattingModel.insertMany(messages, (error, report)=>{
            if(error) { console.log('Messages collection filling up failed!') }
            if(report.length !== messages.length) { console.log('Messages collection misses some document!') }
            console.log('Messages seeding done!')
        })
        
    })
})
.then(()=>{
    //emailreports collection clearing
    EmailReportModel.deleteMany({}, (err, rep)=>{
        if(err){
            console.log('EmailReport collection empting failed!')
        }else{
            console.log('EmailReport collection is empty!')
        }
    })
}).catch(err=>{
    console.log('Error at Promise execution! ' + err)
}).finally(()=>{
    setTimeout(()=>{
        mongoose.connection.close()
    }, 1000)
})


seedingProcess