const mongoose = require("mongoose");

const mataPelajaranSchema = mongoose.Schema(
  {
    kode: {
      type: String,
      required: [true, "Kode tidak boleh kosong!"],
    },
    nama: {
      type: String,
      required: [true, "Nama tidak boleh kosong!"],
    },
    sks: {
      type: Number,
      default: 0,
    },
    kelas: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kelas",
    },
    jurusan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jurusan",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MataPelajaran", mataPelajaranSchema);
