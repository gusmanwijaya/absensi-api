const Admin = require("../models/admin");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../../../../app/error");
const bcrypt = require("bcryptjs");
const { createPayloadAdmin } = require("../../../utils/createPayloadJwt");
const createJwt = require("../../../utils/createJwt");

module.exports = {
  registerAdmin: async (req, res, next) => {
    try {
      const { nama, username, password, role } = req.body;

      if (!nama) throw new CustomError.BadRequest("Nama tidak boleh kosong!");
      if (!username)
        throw new CustomError.BadRequest("Username tidak boleh kosong!");
      if (!password)
        throw new CustomError.BadRequest("Password tidak boleh kosong!");

      const checkUsername = await Admin.findOne({ username }).select(
        "username"
      );
      if (checkUsername)
        throw new CustomError.BadRequest(
          `Username : ${username} sudah terdaftar`
        );

      const data = new Admin({ nama, username, password, role });
      await data.save();
      delete data._doc.password;

      res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        message: "Register admin berhasil!",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  loginAdmin: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      if (!username || !password)
        throw new CustomError.BadRequest(
          "Username atau password tidak boleh kosong!"
        );

      const data = await Admin.findOne({ username });
      if (!data) throw new CustomError.Unauthorized("User tidak ditemukan!");

      const isMatch = await bcrypt.compare(password, data?.password);
      if (!isMatch) throw new CustomError.Unauthorized("Password salah!");

      const payload = createPayloadAdmin(data);
      const token = createJwt(payload);

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Login admin berhasil!",
        data: {
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
