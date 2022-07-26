const mongoose = require("mongoose");

const clinicSchema = mongoose.Schema(
  {
    // identity_code:{
    //   type: String,
    //   required: [true, 'გთხოვთ მიუთითოთ საიდენტიფიკაციო კოდი']
    // },
    // phone_number:{
    //   type: String,
    //   required: [true, 'გთხოვთ მიუთითოთ ტელეფონის ნომერი']
    // },
    // clinic_name:{
    //   type: String,
    //   required: [true, 'გთხოვთ მიუთითოთ კლინიკის დასახელება']
    // },
    // contact_person:{
    //   type: String,
    //   required: [true, 'გთხოვთ მიუთითოთ საკონტაქტო პირი']
    // },
    // contact_person_number:{
    //   type: String,
    //   required: [true, 'გთხოვთ მიუთითოთ საკონტაქტო პირის ტელეფონის ნომერი']
    // },
    // contact_person_email: {
    //   type: String,
    //   required: [true, "გთხოვთ მიუთითოთ საკონტაქტო პირის ელ.ფოსტა"],
    // },
    manager:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    text:{
      type: String,
      required: [true, "გთხოვთ მიუთითოთ ტექსტი"],
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Clinic',clinicSchema)