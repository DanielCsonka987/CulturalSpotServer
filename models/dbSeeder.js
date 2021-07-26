const mongoose = require('mongoose')
const ProfileModel = require('./ProfileModel')

const { dbLocal, dbCloud } = require('../config/dbConfig')
const { profiles, posts, messges } = require('./testdatasToDB')

mongoose.connection.on('connected', ()=>{
    console.log(`DB connection established to ${process.argv[2]} store!`)
}).on('error', ()=>{
    console.log('DB error occured!')
}).once('close', ()=>{
    console.log('DB connection closed!')
})


if(process.argv[2] === 'local'){
    mongoose.connect(dbLocal, {useNewUrlParser: true, useUnifiedTopology: true})
}
if(process.argv[2] === 'cloud'){
    mongoose.connect(dbCloud, {useNewUrlParser: true, useUnifiedTopology: true})
}

//manage profiles collection
mongoose.connections.profiles.drop(err=>{
    //error code 26 = NameSpaceNotFound => collection were already empty
    if(err) {  
        if(err.code !== 26) { console.log('Profiles collection removal failed!') }
    }

    ProfileModel.insertMany(profiles, (error, report)=>{
        if(error) { console.log('Profiles collection filling up failed!') }
        if(report.length !== profiles.lenght) { console.log('Profiles collection misses some document!') }
    })

})

//manage posts collection

//manage messages collection

