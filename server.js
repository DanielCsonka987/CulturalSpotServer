const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 4040;
const DB_CONNECT = (process.env.NODE_ENV === 'production')?
    retquire('./config/dbConfig').dbCloud
    : require('./config/dbConfig').dbLocal
const typeDefs = require('./graphql/typeDef')
const resolvers = require('./graphql/resolvers')
const emailerTrsp = require('./emailer/emailerSetup')
let domain = ''

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req })=>({ 
        req, 
        domain
       
    })
})
const theDBConnect = ()=>{
    mongoose.connect(DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true })
} 

const startServer = new Promise(async (resolve, reject)=>{
    let dbConnectIsRestored = true
    theDBConnect()
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
        dbConnectIsRestored = false;
        const reconRef = setInterval(()=>{ 
            if(dbConnectIsRestored){
                clearInterval(reconRef)
            }else{
                console.log('MongoDB connection restore...')
                theDBConnect() 
            }
        }, 5000 )
    })
    .on('reconnected', ()=>{ console.log('MongoDB connection restored!') })
    resolve(  server.listen({ port: PORT }) )
})
.then(async (srvres)=>{
    console.log('Server running at ' + srvres.url)
    domain = srvres.url;
    emailerTrsp.setupTrsp.then((thing)=>{
        console.log('Email connection establised!')
    }).catch(err=>{
        console.log('Email connection has lost! ' + err)
    })
})
.catch(err=>{
    console.log('Server error occured at setup! ', err);
})

/*
const stopServer = async ()=>{
    server.stop().then(()=>{
        console.log('Server is under shutting down!')
        mongoose.connection.stop()
        console.log('MongoDB closed!')
        emailerTrsp.shutdown.then(()=>{
            console.log('Emailer closed!')
        })
    })
}
*/
startServer;

module.exports.startServer = Promise.resolve(async ()=>{
    await mongoose.connect(DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true })
    await server.listen({ port: PORT })
    await emailerTrsp.setupTrsp
})

module.exports.theServer = server