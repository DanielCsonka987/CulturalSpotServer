const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 4040;
const DB_CONNECT = require('./config/dbConfig').dbLocal
const typeDefs = require('./graphql/typeDef')
const resolvers = require('./graphql/resolvers')

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req })=>({ req })
})


mongoose.connect(DB_CONNECT, 
    { useUnifiedTopology: true, useNewUrlParser: true })
.then(()=>{
    mongoose.connection
    .on('error', err=>{ console.log('MongoDB error occured: ', err) })
    .once('close', ()=>{
        console.log('MongoDB connection closed! Server closing!');
        server.close();
    })
    console.log('MongoDB opened!')
    return server.listen({ port: PORT })
}).then((srvres)=>{
    console.log('Server running at ' + srvres.url)
})
.catch((err)=>{
    console.log('Server error occured! ', err);
});