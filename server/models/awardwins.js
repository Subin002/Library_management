const mongoose=require('mongoose')
const awardwinsSchema = mongoose.Schema({
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
const awardwinsModel=mongoose.model('Award wins',awardwinsSchema)
module.exports=awardwinsModel;