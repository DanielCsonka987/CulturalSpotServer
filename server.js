const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const mongoose = require('mongoose')

const PORT_REST = process.env.PORT || 4040;
const LOCAL_DOMAIN_URL = { apolloUrl: '' }
const { theDBConnect, theDBConfig, theDBExit } = require('./extensions/databaseClientSetup')
const additionalRoutings = require('./controler/routings')

const typeDefs = require('./graphql/typeDef')
const resolvers = require('./graphql/resolvers')
const { authorizTokenInputRevise, authorizTokenVerify, 
    loginRefreshTokenInputRevise, loginRefreshTokenValidate,
    resetTokenInputRevise } 
    = require('./utils/tokenManager')
    

const getDomainURL = require('./utils/defineDomainURL')
const { emailerClienSetup, emailerClienShutdown, emailingServices
      } = require('./extensions/emailerClientSetup')
const { wsExtensionStart, wsExtensionStop 
    } = require('./extensions/wsServer')
const ProfileDataSource = require('./repository/profileDS');
const PostDataSource = require('./repository/postDS')
const CommentDataSource = require('./repository/commentDS')
const ChatDataSource = require('./repository/chatDS')
const MessageDataSource = require('./repository/messageDS')
const UserNotifRepo = require('./extensions/dinamicClientNotifier/userNotifierRepo') 
    
const residentNotifierService = new UserNotifRepo()


const app = express();
const apolloSrv = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: ()=>({
        profiles: new ProfileDataSource(),
        posts: new PostDataSource(),
        comments: new CommentDataSource(),
        chats: new ChatDataSource(),
        messages: new MessageDataSource()
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
        /**
         * for password resetting stp2 - form is sending new password
         * -> marker, from DB, expire 1h
         * => contain id of user and token
         * => encoded with marker + old hashPws
         * /> not fully processed, decoding is still needed
         */
        const pwdResetRes = resetTokenInputRevise(req)
        
        const domainURL = getDomainURL(req, LOCAL_DOMAIN_URL)
        return {
            authorizRes,
            refreshRes,
            pwdResetRes,

            wsNotifier: residentNotifierService,
            emailingServices,
            domainURL
        }
    }

})

const startServer = async (testPurpose, emailerTesting)=>{
    theDBConfig()
    theDBConnect()
    if(!testPurpose){    //it makes JEST erroreous
        //ReferenceError: You are trying to `import` 
        //a file after the Jest environment has been torn down.
        //TypeError: Right-hand side of 'instanceof' is not callable
        await apolloSrv.start()
    }
    apolloSrv.applyMiddleware({ app, path: '/graphql' })

    app.use(express.urlencoded({extended: true}))
    app.use("/", additionalRoutings)
    app.use((err, req, res, next)=>{
        res.status(500).send('Server Internal error occured! ' + err)
    })

    if(!testPurpose){    //it makes to SUPERTEST double configurate the PORT

        // " listen EADDRINUSE: address already in use :::4040 "
        app.listen({ port: PORT_REST })
    }
    
    //extensions
    await emailerClienSetup(emailerTesting)
    wsExtensionStart(residentNotifierService, testPurpose)

    console.log('Server is running!')
    return app
}


startServer();  //sendinblue emailer starts

module.exports.startTestingServer = startServer

module.exports.exitTestingServer = async ()=>{
    await apolloSrv.stop()
    await theDBExit
    await emailerClienShutdown
    wsExtensionStop()
    console.log('Server is stopping!')
}

