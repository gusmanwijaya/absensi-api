const mongoose = require("mongoose");

const kelasSchema = mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "Nama tidak boleh kosong!"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Kelas", kelasSchema);
