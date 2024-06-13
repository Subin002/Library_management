const mongoose=require('mongoose')
const bestsellerSchema = mongoose.Schema({
    image:{
        type:String
    },
    name:{
        type:String
    },
    author:{
        type:String
    },
    description:{
        type:String
    },
    price:{
        type:String
    }
})
const bestsellerModel=mongoose.model('Best seller',bestsellerSchema)
module.exports=bestsellerModel;