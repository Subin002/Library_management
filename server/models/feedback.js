const mongoose=require('mongoose')
const fdSchema=mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    feedback:{
        type:String
    }
})
const fdModel=mongoose.model('feedback', fdSchema)
module.exports=fdModel