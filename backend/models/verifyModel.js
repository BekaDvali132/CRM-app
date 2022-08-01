const mongoose = require('mongoose')

const verifySchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'გთხოვთ მიუთითოთ სახელი'],
        ref: 'User'
    },
    code: {
        type: String,
        required: [true, 'გთხოვთ მიუთითოთ ელექტრონული ფოსტა']
    },
    valid: {
        type: Date,
        required: [true, 'გთხოვთ მიუთითოთ პაროლი']
    }
},
{
    timestamps: true
})

module.exports=mongoose.model('Verify',verifySchema)