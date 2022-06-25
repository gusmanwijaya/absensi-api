const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const siswaSchema = mongoose.Schema(
  {
    nisn: {
      type: String,
      required: [true, "NISN tidak boleh kosong!"],
    },
    nama: {
      type: String,
      required: [true, "Nama tidak boleh kosong!"],
    },
    jenisKelamin: {
      type: String,
      enum: ["L", "P"],
      default: "L",
    },
    agama: {
      type: String,
    },
    alamat: {
      type: String,
    },
    noHp: {
      type: String,
    },
    kelas: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kelas",
    },
    jurusan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jurusan",
    },
    mataPelajaran: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MataPelajaran",
      },
    ],
    username: {
      type: String,
      required: [true, "Username tidak boleh kosong!"],
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "guru", "siswa", "orangtua"],
      default: "siswa",
    },
  },
  { timestamps: true }
);

siswaSchema.pre("save", function () {
  if (!this.isModified("password")) return;
  this.password = bcrypt.hashSync(this.password, 10);
});

module.exports = mongoose.model("Siswa", siswaSchema);
