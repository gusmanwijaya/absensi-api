const Admin = require("../models/admin");
const Guru = require("../models/guru");
const Siswa = require("../models/siswa");
const OrangTua = require("../models/orang-tua");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../../../../app/error");
const bcrypt = require("bcryptjs");
const {
  createPayloadAdmin,
  createPayloadGuru,
  createPayloadSiswa,
  createPayloadOrangTua,
} = require("../../../utils/createPayloadJwt");
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
  ubahPasswordAdmin: async (req, res, next) => {
    try {
      const { id: adminId } = req.params;
      const { oldPassword, newPassword, confirmNewPassword } = req.body;

      if (!oldPassword || !newPassword || !confirmNewPassword)
        throw new CustomError.BadRequest("Semua field tidak boleh kosong!");

      let data = await Admin.findOne({ _id: adminId }).select(
        "_id username password"
      );
      if (!data) throw new CustomError.Unauthorized("User tidak ditemukan!");

      const isMatch = await bcrypt.compare(oldPassword, data?.password);
      if (!isMatch) throw new CustomError.Unauthorized("Password lama salah!");

      if (oldPassword === newPassword)
        throw new CustomError.BadRequest(
          "Password baru sama dengan (=) password lama!"
        );

      if (newPassword !== confirmNewPassword)
        throw new CustomError.BadRequest(
          "Password baru tidak sama dengan (!=) konfirmasi password!"
        );

      data.password = newPassword;
      await data.save();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Ubah password berhasil!",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  ubahPasswordGuru: async (req, res, next) => {
    try {
      const { id: guruId } = req.params;
      const { oldPassword, newPassword, confirmNewPassword } = req.body;

      if (!oldPassword || !newPassword || !confirmNewPassword)
        throw new CustomError.BadRequest("Semua field tidak boleh kosong!");

      let data = await Guru.findOne({ _id: guruId }).select(
        "_id username password"
      );
      if (!data) throw new CustomError.Unauthorized("User tidak ditemukan!");

      const isMatch = await bcrypt.compare(oldPassword, data?.password);
      if (!isMatch) throw new CustomError.Unauthorized("Password lama salah!");

      if (oldPassword === newPassword)
        throw new CustomError.BadRequest(
          "Password baru sama dengan (=) password lama!"
        );

      if (newPassword !== confirmNewPassword)
        throw new CustomError.BadRequest(
          "Password baru tidak sama dengan (!=) konfirmasi password!"
        );

      data.password = newPassword;
      await data.save();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Ubah password berhasil!",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  ubahPasswordSiswa: async (req, res, next) => {
    try {
      const { id: siswaId } = req.params;
      const { oldPassword, newPassword, confirmNewPassword } = req.body;

      if (!oldPassword || !newPassword || !confirmNewPassword)
        throw new CustomError.BadRequest("Semua field tidak boleh kosong!");

      let data = await Siswa.findOne({ _id: siswaId }).select(
        "_id username password"
      );
      if (!data) throw new CustomError.Unauthorized("User tidak ditemukan!");

      const isMatch = await bcrypt.compare(oldPassword, data?.password);
      if (!isMatch) throw new CustomError.Unauthorized("Password lama salah!");

      if (oldPassword === newPassword)
        throw new CustomError.BadRequest(
          "Password baru sama dengan (=) password lama!"
        );

      if (newPassword !== confirmNewPassword)
        throw new CustomError.BadRequest(
          "Password baru tidak sama dengan (!=) konfirmasi password!"
        );

      data.password = newPassword;
      await data.save();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Ubah password berhasil!",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  ubahPasswordOrangTua: async (req, res, next) => {
    try {
      const { id: orangTuaId } = req.params;
      const { oldPassword, newPassword, confirmNewPassword } = req.body;

      if (!oldPassword || !newPassword || !confirmNewPassword)
        throw new CustomError.BadRequest("Semua field tidak boleh kosong!");

      let data = await OrangTua.findOne({ _id: orangTuaId }).select(
        "_id username password"
      );
      if (!data) throw new CustomError.Unauthorized("User tidak ditemukan!");

      const isMatch = await bcrypt.compare(oldPassword, data?.password);
      if (!isMatch) throw new CustomError.Unauthorized("Password lama salah!");

      if (oldPassword === newPassword)
        throw new CustomError.BadRequest(
          "Password baru sama dengan (=) password lama!"
        );

      if (newPassword !== confirmNewPassword)
        throw new CustomError.BadRequest(
          "Password baru tidak sama dengan (!=) konfirmasi password!"
        );

      data.password = newPassword;
      await data.save();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Ubah password berhasil!",
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
  loginGuru: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      if (!username || !password)
        throw new CustomError.BadRequest(
          "Username atau password tidak boleh kosong!"
        );

      const data = await Guru.findOne({ username });
      if (!data) throw new CustomError.Unauthorized("User tidak ditemukan!");

      const isMatch = await bcrypt.compare(password, data?.password);
      if (!isMatch) throw new CustomError.Unauthorized("Password salah!");

      const payload = createPayloadGuru(data);
      const token = createJwt(payload);

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Login guru berhasil!",
        data: {
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  loginSiswa: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      if (!username || !password)
        throw new CustomError.BadRequest(
          "Username atau password tidak boleh kosong!"
        );

      const data = await Siswa.findOne({ username });
      if (!data) throw new CustomError.Unauthorized("User tidak ditemukan!");

      const isMatch = await bcrypt.compare(password, data?.password);
      if (!isMatch) throw new CustomError.Unauthorized("Password salah!");

      const payload = createPayloadSiswa(data);
      const token = createJwt(payload);

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Login siswa berhasil!",
        data: {
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  loginOrangTua: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      if (!username || !password)
        throw new CustomError.BadRequest(
          "Username atau password tidak boleh kosong!"
        );

      const data = await OrangTua.findOne({ username });
      if (!data) throw new CustomError.Unauthorized("User tidak ditemukan!");

      const isMatch = await bcrypt.compare(password, data?.password);
      if (!isMatch) throw new CustomError.Unauthorized("Password salah!");

      const payload = createPayloadOrangTua(data);
      const token = createJwt(payload);

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Login orang tua berhasil!",
        data: {
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
