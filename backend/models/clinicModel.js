const mongoose = require("mongoose");

const clinicSchema = mongoose.Schema(
  {
    identity_code:{
      type: String,
      required: [false, 'გთხოვთ მიუთითოთ საიდენტიფიკაციო კოდი']
    },
    phone_number:{
      type: String,
      required: [true, 'გთხოვთ მიუთითოთ ტელეფონის ნომერი']
    },
    name:{
      type: String,
      required: [true, 'გთხოვთ მიუთითოთ კლინიკის დასახელება']
    },
    contact_person:{
      phone_number:{
        type:String,
        required: [false,'გთხოვთ მიუთითოთ საკონტაქტო პირის ტელეფონის ნომერი']
      },
      email: {
        type: String,
        required: [false, "გთხოვთ მიუთითოთ საკონტაქტო პირის ელ.ფოსტა"],
      },
      position: {
        type: String,
        required: [false, "გთხოვთ მიუთითოთ საკონტაქტო პირის პოზიცია"],
      },
    },
    status:{
      type: String,
      required: [true, "გთხოვთ მიუთითოთ სტატუსი"],
    },
    register_date:{
      type: String,
      required: [true, "გთხოვთ მიუთითოთ რეგისტრაციის თარიღი"],
    },
    contract_date:{
      type: String,
      required: [true, "გთხოვთ მიუთითოთ კონტრაქტის თარიღი"],
    },
    manager:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    comment:{
      type: String,
      required: [false, "გთხოვთ მიუთითოთ კომენტარი"],
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Clinic',clinicSchema)