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

const apolloSrv = new ApolloServer({
    typeDefs,
    resolvers,
    context: async({ req, res })=>{

        const authorazRes = await tokenVerify( tokenInputRevise(req) );
        const domainURL = getDomainURL(req, LOCAL_DOMAIN_URL)
        return {
            authorazRes,
            domainURL
        }
    }

})
const app = express();
//publish langing fornt-app
app.get("/", (req, res)=>{ res.send("<h1>GET request accepted</h1>")  })
//manage GET resetPassword request
app.get(RESETPWD_REST_GET_ROUTE, (req, res)=>{ res.send("<h1>GET request accepted 2</h1>")  })

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

const startServer = new Promise(async (resolve, reject)=>{
    theDBConnect()
    theDBConfig()
    await apolloSrv.start()
    apolloSrv.applyMiddleware({ app, path: '/graphql' })
    resolve( app.listen({ port: PORT }) )
})
.then(async (srvres)=>{
    console.log('Server is running!')
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

module.exports.startTestingServer = async ()=>{

    const apolloSrv = new ApolloServer({
        typeDefs,
        resolvers
    })
    mongoose.connect(DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true })
    await emailerTrsp.setupTrsp
    
    return apolloSrv;
}

module.exports.theServer = app