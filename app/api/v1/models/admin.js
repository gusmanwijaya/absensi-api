const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "Nama tidak boleh kosong!"],
    },
    username: {
      type: String,
      required: [true, "Username tidak boleh kosong!"],
    },
    password: {
      type: String,
      required: [true, "Password tidak boleh kosong!"],
    },
    role: {
      type: String,
      enum: ["admin", "guru", "siswa", "orangtua"],
      default: "admin",
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", function () {
  if (!this.isModified("password")) return;
  this.password = bcrypt.hashSync(this.password, 10);
});

module.exports = mongoose.model("Admin", adminSchema);
