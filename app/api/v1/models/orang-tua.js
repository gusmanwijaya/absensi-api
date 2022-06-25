const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const orangTua = mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "Nama tidak boleh kosong!"],
    },
    alamat: {
      type: String,
    },
    noHp: {
      type: String,
    },
    siswa: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Siswa",
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
      default: "orangtua",
    },
  },
  { timestamps: true }
);

orangTua.pre("save", function () {
  if (!this.isModified("password")) return;
  this.password = bcrypt.hashSync(this.password, 10);
});

module.exports = mongoose.model("OrangTua", orangTua);
