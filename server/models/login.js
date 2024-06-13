
const mongoose = require('mongoose')

const authSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    
    isAdmin:{
        type:Boolean,
        default:false
    },
    cart: [{
        cartId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'carts'
        },
    }]
},{
    timestamps:true,
})

const authModel = mongoose.model("Auth", authSchema)
module.exports = authModel