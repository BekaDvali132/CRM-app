const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'გთხოვთ მიუთითოთ სახელი']
    },
    email: {
        type: String,
        required: [true, 'გთხოვთ მიუთითოთ ელექტრონული ფოსტა']
    },
    password: {
        type: String,
        required: [true, 'გთხოვთ მიუთითოთ პაროლი']
    },
    role:{
        type: Number,
        required: [true, 'გთხოვთ მიუთითოთ მომხმარებლის როლი']
    }
},
{
    timestamps: true
})

module.exports=mongoose.model('User',userSchema)