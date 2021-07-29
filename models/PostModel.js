const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    


})


const CommentSchema = new mongoose.Schema({

})

module.exports.post = mongoose.model('posts', PostSchema)
module.exports.comment = CommentSchema