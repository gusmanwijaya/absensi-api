const mongoose = require("mongoose");

const absensiSchema = mongoose.Schema({
  tanggal: {
    type: String,
  },
  pertemuan: {
    type: Number,
  },
  mataPelajaran: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MataPelajaran",
  },
  siswa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Siswa",
  },
  guru: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guru",
  },
  keterangan: {
    type: String,
    enum: ["Hadir", "Izin", "Sakit", "Alpa"],
    default: "Alpa",
  },
});

module.exports = mongoose.model("Absensi", absensiSchema);
