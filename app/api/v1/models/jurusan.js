const mongoose = require("mongoose");

const jurusanSchema = mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "Nama tidak boleh kosong!"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Jurusan", jurusanSchema);
