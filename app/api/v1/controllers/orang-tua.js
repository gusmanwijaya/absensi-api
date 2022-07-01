const OrangTua = require("../models/orang-tua");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../../../error");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const data = await OrangTua.find()
        .select("_id nama alamat noHp siswa username password role")
        .limit(limit)
        .skip(limit * (page - 1))
        .populate({
          path: "siswa",
          select:
            "_id nisn nama jenisKelamin agama alamat noHp kelas jurusan mataPelajaran",
          model: "Siswa",
          populate: [
            {
              path: "kelas",
              select: "_id nama",
              model: "Kelas",
            },
            {
              path: "jurusan",
              select: "_id nama",
              model: "Jurusan",
            },
            {
              path: "mataPelajaran",
              select: "_id kode nama sks kelas jurusan",
              model: "MataPelajaran",
              populate: [
                {
                  path: "kelas",
                  select: "_id nama",
                  model: "Kelas",
                },
                {
                  path: "jurusan",
                  select: "_id nama",
                  model: "Jurusan",
                },
              ],
            },
          ],
        });

      const count = await OrangTua.countDocuments();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Berhasil mendapatkan data orang tua",
        current_page: parseInt(page),
        total_page: Math.ceil(count / limit),
        total_data: count,
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  getOne: async (req, res, next) => {
    try {
      const { id: orangTuaId } = req.params;

      const data = await OrangTua.findOne({ _id: orangTuaId })
        .select("_id nama alamat noHp siswa username role")
        .populate({
          path: "siswa",
          select:
            "_id nisn nama jenisKelamin agama alamat noHp kelas jurusan mataPelajaran",
          model: "Siswa",
          populate: [
            {
              path: "kelas",
              select: "_id nama",
              model: "Kelas",
            },
            {
              path: "jurusan",
              select: "_id nama",
              model: "Jurusan",
            },
            {
              path: "mataPelajaran",
              select: "_id kode nama sks kelas jurusan",
              model: "MataPelajaran",
              populate: [
                {
                  path: "kelas",
                  select: "_id nama",
                  model: "Kelas",
                },
                {
                  path: "jurusan",
                  select: "_id nama",
                  model: "Jurusan",
                },
              ],
            },
          ],
        });

      if (!data)
        throw new CustomError.NotFound(
          `Orang tua dengan id ${orangTuaId} tidak ditemukan`
        );

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Berhasil mendapatkan data orang tua",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      const { nama, alamat, noHp, siswa, username, password } = req.body;

      if (!password)
        throw new CustomError.BadRequest("Password tidak boleh kosong!");

      const checkUsername = await OrangTua.findOne({ username }).select(
        "username"
      );
      if (checkUsername)
        throw new CustomError.BadRequest(
          `Username : ${username} sudah terdaftar`
        );

      const data = new OrangTua({
        nama,
        alamat,
        noHp,
        siswa: JSON.parse(siswa),
        username,
        password,
      });
      await data.save();
      delete data._doc.password;

      res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        message: "Data orang tua berhasil ditambahkan",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id: orangTuaId } = req.params;
      const { nama, alamat, noHp, siswa, username } = req.body;

      const checkUsername = await OrangTua.findOne({
        _id: {
          $ne: orangTuaId,
        },
        username,
      }).select("username");
      if (checkUsername)
        throw new CustomError.BadRequest(
          `Username : ${username} sudah terdaftar`
        );

      let data = await OrangTua.findOne({ _id: orangTuaId });

      if (!data)
        throw new CustomError.NotFound(
          `Orang tua dengan id ${orangTuaId} tidak ditemukan`
        );

      data.nama = nama;
      data.alamat = alamat;
      data.noHp = noHp;
      data.siswa = JSON.parse(siswa);
      data.username = username;
      await data.save();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Data orang tua berhasil diubah",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  destroy: async (req, res, next) => {
    try {
      const { id: orangTuaId } = req.params;

      let data = await OrangTua.findOne({ _id: orangTuaId });

      if (!data)
        throw new CustomError.NotFound(
          `Orang tua dengan id ${orangTuaId} tidak ditemukan`
        );

      await data.remove();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Data orang tua berhasil dihapus",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
