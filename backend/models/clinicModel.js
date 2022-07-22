const mongoose = require("mongoose");

const clinicSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "გთხოვთ შეავსოთ ტექსტური ველი"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Clinic',clinicSchema)