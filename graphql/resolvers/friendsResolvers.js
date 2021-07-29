
const ProfileModel = require('../../models/ProfileModel')

module.exports = {

    Query: {

        listOfMyFriends: ()=>{

        },
        listOfFriendsOf: (_, args, context)=>{
            args.friendid
        }

    },
    Mutation: {
        makeAFriend: (_, args, context)=>{
            args.friendid
        },
        removeAFriend: (_, args, context)=>{
            args.friendid
        }
    }
}