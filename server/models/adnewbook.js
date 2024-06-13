const mongoose=require('mongoose')
const newbookSchema=mongoose.Schema({

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

const newbookModel=mongoose.model('New Arrivals',newbookSchema);
module.exports=newbookModel;