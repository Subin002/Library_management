const mongoose=require('mongoose')
const InterSchema=mongoose.Schema({
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

const InterModel=mongoose.model('International', InterSchema)
module.exports=InterModel