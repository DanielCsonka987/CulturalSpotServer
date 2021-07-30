const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 4040;
const DB_CONNECT = (process.env.NODE_ENV === 'production')?
    retquire('./config/dbConfig').dbCloud
    : require('./config/dbConfig').dbLocal
const typeDefs = require('./graphql/typeDef')
const resolvers = require('./graphql/resolvers')
const emailerTrsp = require('./emailer/emailerSetup')
const { tokenInputRevise, tokenVerify } = require('./utils/tokenManager')
const getDomainURL = require('./utils/defineDomainURL')
const { RESETPWD_REST_GET_ROUTE } = require('./config/appConfig').ROUTING

const LOCAL_DOMAIN_URL = { url: '' }

const app = express();
const apolloSrv = new ApolloServer({
    typeDefs,
    resolvers,
    context: async({ req, res })=>{

        const authorizRes = await tokenVerify( tokenInputRevise(req) );
        const domainURL = getDomainURL(req, LOCAL_DOMAIN_URL)
        return {
            authorizRes,
            domainURL
        }
    }

})

const theDBConnect = ()=>{
    mongoose.connect(DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true })
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
}

const startServer = async (testPurpose)=>{
    theDBConfig()
    theDBConnect()
    if(!testPurpose){    //it makes JEST erroreous
        //ReferenceError: You are trying to `import` a file after the Jest environment has been torn down.
        //TypeError: Right-hand side of 'instanceof' is not callable
        await apolloSrv.start()
    }
    apolloSrv.applyMiddleware({ app, path: '/graphql' })

    //publish frontpage to fornt-app
    app.get("/", (req, res)=>{ res.send("<h1>GET request accepted - frontpage is sent!</h1>")  })
    //manage GET resetPassword request
    app.get(RESETPWD_REST_GET_ROUTE, (req, res)=>{ res.send("<h1>GET request accepted 2</h1>")  })

    if(!testPurpose){    //it makes to SUPERTEST double configurate the PORT
        //listen EADDRINUSE: address already in use :::4040
        app.listen({ port: PORT })
    }
    console.log('Server is running!')

    emailerTrsp.setupTrsp.then(()=>{
        console.log('Email connection establised!')
    }).catch(err=>{
        console.log('Email connection has lost! ' + err)
    })
    return app
}


startServer();

module.exports.startTestingServer = startServer

module.exports.exitTestingServer = async ()=>{
   await apolloSrv.stop()
   await mongoose.connection.removeAllListeners()
   await mongoose.connection.close()
   await emailerTrsp.shutdown
   console.log('Server is stopping!')
}