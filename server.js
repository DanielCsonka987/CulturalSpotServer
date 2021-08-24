const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 4040;
const DB_CONNECT = (process.env.NODE_ENV === 'production')?
    retquire('./config/dbConfig').dbCloud
    : require('./config/dbConfig').dbLocal
const LOCAL_DOMAIN_URL = { url: '' }
const additionalRoutings = require('./controler/routings')

const typeDefs = require('./graphql/typeDef')
const resolvers = require('./graphql/resolvers')
const { authorizTokenInputRevise, authorizTokenVerify, 
    loginRefreshTokenInputRevise, loginRefreshTokenValidate } 
    = require('./utils/tokenManager')
    
const getDomainURL = require('./utils/defineDomainURL')
const emailerTrsp = require('./emailer/emailerSetup')
const ProfileDataSource = require('./repository/profileDS');
const PostDataSource = require('./repository/postDS')
const CommentDataSource = require('./repository/commentDS')

const app = express();
const apolloSrv = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: ()=>({
        profiles: new ProfileDataSource(),
        posts: new PostDataSource(),
        comments: new CommentDataSource(),
        //chattings
        //wsStorage
    }),
    context: async({ req, res })=>{
        /**
         * for the authorization the token consist
         * -> subj (as userid), email fields and expiration 1 hour
         */
        const authorizRes = await authorizTokenVerify( 
            authorizTokenInputRevise(req) 
        );
        /**
         * for the authorization refresh the token consist 
         * -> id (user identification), no exp field!!
         * => no user of authorizRes and authorazEvaluation() with this!
         * => authorizTokenInputRevise() no valid either (its for header revision)
        */
        const refreshRes = await loginRefreshTokenValidate(
            loginRefreshTokenInputRevise(req)
        )
        const domainURL = getDomainURL(req, LOCAL_DOMAIN_URL)
        return {
            authorizRes,
            refreshRes,
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
        //ReferenceError: You are trying to `import` 
        //a file after the Jest environment has been torn down.
        //TypeError: Right-hand side of 'instanceof' is not callable
        await apolloSrv.start()
    }
    apolloSrv.applyMiddleware({ app, path: '/graphql' })

    //app.use(bodyParser.urlencoded({extended: true}))
    app.use(express.urlencoded({extended: true}))
    app.use("/", additionalRoutings)
    app.use((err, req, res, next)=>{
        res.status(500).send('Server Internal error occured! ' + err)
    })

    if(!testPurpose){    //it makes to SUPERTEST double configurate the PORT

        // " listen EADDRINUSE: address already in use :::4040 "
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
   await mongoose.disconnect()
   await emailerTrsp.shutdown
   console.log('Server is stopping!')
}