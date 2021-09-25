const mongoose = require('mongoose')
const DB_CONNECT = require('../config/dbConfig').dbCloud

let reconnectionDesired = true

const theDBConnect = ()=>{
    mongoose.connect(DB_CONNECT, { 
        useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
} 
const theDBConfig = ()=>{
    let dbConnectIsRestored = true
    mongoose.connection
    .on('connected', ()=>{
        dbConnectIsRestored = true;
        console.log('MongoDB opened!') 
    })
    .on('error', err=>{ console.log('MongoDB error occured: ', err) })
    .once('close', ()=>{
        console.log('MongoDB connection closed!');
    })
    .on('disconnected', ()=>{
        if(reconnectionDesired){
            dbConnectIsRestored = false;
            const reconRef = setInterval(()=>{ 
                if(dbConnectIsRestored){
                    clearInterval(reconRef)
                }else{
                    console.log('MongoDB connection restore...')
                    theDBConnect() 
                }
            }, 5000 )
        }
    })
    .on('reconnected', ()=>{ console.log('MongoDB connection restored!') })
}
const theDBExit = async ()=>{
    reconnectionDesired = false
    //await mongoose.connection.removeAllListeners()
    await mongoose.close()
}
module.exports = {
    theDBConnect, theDBConfig, theDBExit
}