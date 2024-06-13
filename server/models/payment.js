const mongoose=require('mongoose')
const paymentSchema=mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    address:{
        type:String
    },
    productname:{
        type:String
    },
    price:{
        type:String
    },
    debitCardNumber:{
        type:Number
    },
    expiryDate:{
        type:Number
    },
    cvv:{
        type:Number
    },
})
const paymentModel=mongoose.model('Ordered',paymentSchema)
module.exports=paymentModel